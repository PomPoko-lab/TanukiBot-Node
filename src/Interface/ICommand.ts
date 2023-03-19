import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import DisTube from 'distube';
import { IExtendedClient } from './IExtendedClient';

export interface ICommand {
	name: SlashCommandBuilder;
	devOnly: boolean;
	enabled: boolean;
	function: (
		interaction: ChatInputCommandInteraction,
		client: IExtendedClient,
		distube: DisTube
	) => any;
}
