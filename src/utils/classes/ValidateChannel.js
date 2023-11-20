/**
 * @typedef {import('discord.js').VoiceBasedChannel} VoiceBasedChannel
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('distube').Queue} Queue
 */

/**
 * Checks if the user is in a voice channel. If not, replies with an error message.
 * @param {VoiceBasedChannel | null | undefined} voiceChannel The voice channel to check.
 * @param {CommandInteraction} interaction Discord interaction object for replying.
 * @returns {boolean} Whether or not the user is in a voice channel.
 */
const userInChannel = (voiceChannel, interaction) => {
	// If user is NOT in a voice channel
	if (!voiceChannel) {
		interaction.reply({
			content: 'No voice channel detected.',
			ephemeral: true,
		});
		return false;
	}
	return true;
};

/**
 * Checks if the queue exists. If not, replies with an error message.
 * @param {Queue | null | undefined} queue The queue to check.
 * @param {*} interaction Discord interaction object for replying.
 * @returns {boolean} Whether or not the queue exists.
 */
const hasQueue = (queue, interaction) => {
	if (!queue) {
		interaction.reply({
			content: 'No current queue detected.',
			ephemeral: true,
		});
		return false;
	}
	return true;
};

/**
 * Compares the url to a list of valid YouTube url strings. If not, replies with an error message.
 * @param {string | null | undefined} url The url to check.
 * @param {CommandInteraction} interaction Discord interaction object for replying.
 * @returns {boolean} Whether or not the url is valid.
 */
const isValidUrl = (url, interaction) => {
	const VALID_YOUTUBE_STRINGS = ['youtu.be/', 'youtube.com/watch?v='];

	const valid = VALID_YOUTUBE_STRINGS.some((validString) => {
		if (url && url.includes(validString)) return true;
		return false;
	});
	if (!valid) {
		interaction.reply({
			content: 'No valid URL or search detected.',
			ephemeral: true,
		});
		return false;
	}
	return true;
};

module.exports = {
	userInChannel,
	hasQueue,
	isValidUrl,
};
