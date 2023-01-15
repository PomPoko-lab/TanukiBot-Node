import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import dotenv from 'dotenv';

import DisTube from 'distube';
import { Configuration, OpenAIApi } from 'openai';
import { IExtendedClient } from '../Interface/IExtendedClient';

module.exports = {
	name: new SlashCommandBuilder()
		.setName('chat')
		.setDescription('Sends ChatGPT prompt')
		.addStringOption((option) =>
			option
				.setName('prompt')
				.setDescription('Input prompt')
				.setRequired(true)
		),
	function: async (
		interaction: ChatInputCommandInteraction,
		client: IExtendedClient,
		distube: DisTube
	) => {
		dotenv.config();

		const openai = new OpenAIApi(
			new Configuration({
				apiKey: process.env.KEY_OPEN_AI_API,
			})
		);
		const prompt = interaction.options.getString('prompt');

		if (!prompt) {
			return interaction.reply('No prompt specifed.');
		}

		try {
			await interaction.deferReply();

			const response = await openai.createCompletion({
				model: 'text-davinci-003',
				prompt: prompt,
				temperature: 0.9,
				max_tokens: 1000,
				top_p: 1,
				frequency_penalty: 0.0,
				presence_penalty: 0.6,
			});

			if (response.status !== 200 && response.data.choices.length) {
				return interaction.editReply(
					'Something went wrong submitting the prompt.'
				);
			}
			const reply = response.data.choices[0].text;

			const message = new EmbedBuilder()
				.setTitle(`${prompt}`)
				.setAuthor({
					name: `OpenAI Request by ${interaction.user.username}`,
				})
				.addFields([
					{
						name: 'Reply:',
						value: reply!,
					},
				]);
			interaction.editReply({
				embeds: [message],
			});
		} catch (err) {
			console.log(err);
		}
	},
};
