import {
	ChatInputCommandInteraction,
	GuildMember,
	SlashCommandBuilder,
} from 'discord.js';

import { userInChannel, hasQueue } from '../utils/ValidateChannel';

import DisTube, { GuildIdResolvable } from 'distube';
import { IExtendedClient } from '../Interface/IExtendedClient';
import { ICommand } from '../Interface/ICommand';

module.exports = {
	name: new SlashCommandBuilder()
		.setName('toggleautoplay')
		.setDescription('Toggles the autoplay feature'),
	function: async (
		interaction: ChatInputCommandInteraction,
		client: IExtendedClient,
		distube: DisTube
	) => {
		const voiceChannel = (interaction.member as GuildMember).voice.channel;
		const guild = interaction.guild as GuildIdResolvable;
		const songQueue = distube.getQueue(guild);
		const playingChannel = songQueue?.voiceChannel;

		// Checks if member is in a voice channel
		if (!userInChannel(voiceChannel, interaction)) return;

		// Checks if currently playing
		if (!userInChannel(playingChannel, interaction)) return;

		// Checks if queue is valid
		if (!hasQueue(songQueue, interaction)) return;

		const results = distube.toggleAutoplay(guild);

		interaction.reply(
			`Auto play mode has been set to ${results ? 'ON' : 'OFF'}`
		);
	},
} as ICommand;
