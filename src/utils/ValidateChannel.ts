import { CommandInteraction, VoiceBasedChannel } from 'discord.js';
import { Queue } from 'distube';

const VALID_YOUTUBE_STRINGS = ['youtu.be/', 'youtube.com/watch?v='];

export const userInChannel = (
	voiceChannel: VoiceBasedChannel | null | undefined,
	interaction: CommandInteraction
) => {
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

export const hasQueue = (
	queue: Queue | null | undefined,
	interaction: CommandInteraction
) => {
	if (!queue) {
		interaction.reply({
			content: 'No current queue detected.',
			ephemeral: true,
		});
		return false;
	}
	return true;
};

export const isValidUrl = (
	url: string | null | undefined,
	interaction: CommandInteraction
) => {
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
