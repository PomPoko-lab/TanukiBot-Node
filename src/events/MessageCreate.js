const { Events } = require('discord.js');
const { OpenAI } = require('../classes/OpenAI');

/** @typedef {import('discord.js').Message} Message */

/**
 *
 * @param {Message} message
 * @param {string} botId
 * @returns
 */
const botReplyToUser = async (message, botId) => {
	const user = message.author;
	global.clientLogger.log(`Mentioned by ${user.username}#${user.discriminator}`);

	try {
		const openAI = new OpenAI();

		await message.channel.sendTyping();
		const aiResponse = await openAI.getChatResponse(message, botId);
		if (!aiResponse) {
			global.clientLogger.error('AI response was undefined.');
			return;
		}
		await message.reply(aiResponse);
	} catch (e) {
		global.clientLogger.error(`Something went wrong replying to ${user.username}`);
	}
};

/**
 *
 * @param {Message} message
 * @returns
 */
const callbackAction = async (message) => {
	/** @type {import('../classes/ExtendedClient')} */
	// @ts-ignore
	const client = message.client;
	const user = message.author;

	// If user is not the bot return
	// TODO:
	//		- Make sure the bot won't reply to the 2nd bot as well
	//		- A Logging function
	// FIXME
	if (user.id === client.user?.id || user.id === '625404504564695072') {
		return;
	}

	// User mentioned the bot
	//	@ts-ignore
	if (message.mentions.has(client.user?.id)) {
		// @ts-ignore
		botReplyToUser(message, client.user?.id);
	}

	if (message.content.includes('deez')) {
		try {
			global.clientLogger.log(
				`Gave ${user.username}#${user.discriminator} some of deez nuts..`
			);
			await message.reply('nuts');
		} catch (e) {
			global.clientLogger.error(`Something went wrong executing command: 'deez'`);
		}
	}
};

module.exports = {
	name: Events.MessageCreate,
	function: callbackAction,
};
