const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

const clientLogger = require('../utils/classes/ClientLogger');

module.exports = class OpenAI {
	#openAi;
	#configs;
	#openAiModel;

	constructor() {
		dotenv.config();

		if (!process.env.KEY_OPEN_AI_API) {
			clientLogger.error('No OpenAI model specified in the .env file.');
			throw new Error('No OpenAI API key found.');
		}

		this.#configs = new Configuration({
			apiKey: process.env.KEY_OPEN_AI_API,
		});

		this.#openAi = new OpenAIApi(this.#configs);

		if (process.env.OPENAI_MODEL === undefined) {
			clientLogger.error('No OpenAI model specified in the .env file.');
			throw new Error('No OpenAI model specified in the .env file.');
		}
		const openAiModel = process.env.OPENAI_MODEL;

		if (!openAiModel) {
			clientLogger.error('No OpenAI model specified in the .env file.');
			throw new Error('No OpenAI model specified in the .env file.');
		}

		this.#openAiModel = openAiModel;
	}

	/**
	 * Make an API call to OpenAI to get a response to a chat message.
	 * @param {import('discord.js').Message} message The message to get a response to.
	 * @param {string} botId The ID of the bot to get a response from.
	 * @returns {Promise<string | undefined>}
	 */
	async getChatResponse(message, botId) {
		const maxChars = 50; // For testing/debugging
		// const maxChars = 100;
		const maxTokens = 500;
		const personaName = 'Tanuki';

		dotenv.config();
		const persona = process.env.TANUKI_BOT_PERSONA;

		if (!persona) {
			clientLogger.error('No bot persona specified in the .env file.');
			throw new Error('No persona specified in the .env file.');
		}

		// Replace the bot mention with the bot's persona name
		const prompt = message.content.replace(`<@${botId}>`, personaName);
		const messageContentWithUsernames = prompt.replace(/<@!?(\d+)>/g, (match, id) => {
			const user = message.client.users.cache.get(id);
			return user ? `${user.username}` : match;
		});

		if (!prompt) {
			clientLogger.error('No prompt specified when trying to get an AI response.');
			return;
		}

		const response = await this.#openAi.createChatCompletion({
			model: this.#openAiModel,
			messages: [
				{
					role: 'system',
					content: `${persona}. Your response should be less than ${maxChars} characters.`,
				},
				{
					role: 'user',
					content: messageContentWithUsernames,
				},
			],
			max_tokens: maxTokens,
		});

		if (response.status !== 200 && response.data.choices.length) {
			clientLogger.error('OpenAI response status was not a success.');
			clientLogger.error(response);
			return;
		}

		const replyMessage = response.data.choices[0].message?.content;

		if (replyMessage) {
			clientLogger.log(response.data);
			clientLogger.log(replyMessage);
			clientLogger.log(`Response length: ${replyMessage.length}`);
		} else {
			clientLogger.error(`OpenAI Response was undefined for prompt: ${prompt}.`);
		}

		return response.data.choices[0].message?.content;
	}

	/**
	 * Make an API call to OpenAI to get a response to a chat message.
	 * @param {string} prompt
	 * @returns {Promise<string | undefined>}
	 */
	async getLanguageResponse(prompt) {
		const maxChars = 500; // For testing/debugging
		// const maxChars = 2000;
		const maxTokens = 1000;
		const response = await this.#openAi.createChatCompletion({
			model: this.#openAiModel,
			messages: [
				{
					role: 'system',
					content: `Your response should be less than ${maxChars} characters.`,
				},
				{
					role: 'user',
					content: prompt,
				},
			],
			max_tokens: maxTokens,
		});

		if (response.status !== 200 && response.data.choices.length) {
			clientLogger.error('OpenAI response status was not a success.');
			clientLogger.error(response);
			return;
		}

		const replyMessage = response.data.choices[0].message?.content;

		if (replyMessage) {
			clientLogger.log(response.data);
			clientLogger.log(replyMessage);
			clientLogger.log(`Response length: ${replyMessage.length}`);
		} else {
			clientLogger.error(`OpenAI Response was undefined for prompt: ${prompt}.`);
		}

		return response.data.choices[0].message?.content;
	}
};
