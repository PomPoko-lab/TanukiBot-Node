import { Client, GatewayIntentBits } from 'discord.js';
import DisTube from 'distube';
import dotenv from 'dotenv';

// Util imports
import { IExtendedClient } from './Interface/IExtendedClient';
import { InitSequence } from './utils/InitSequence';

// Init the env file
dotenv.config();

declare global {
	var client: IExtendedClient;
	var distube: DisTube;
}

global.client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
}) as IExtendedClient;

global.distube = new InitSequence().distube;
