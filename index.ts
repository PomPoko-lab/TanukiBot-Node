import DiscordJS, { Intents } from 'discord.js';
import WOKCommands from 'wokcommands';
import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { SpotifyPlugin } from '@distube/spotify';

import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

// Creating Discord Client

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// Creating Distube client

export const distube = new DisTube(client, {
  leaveOnEmpty: false,
  leaveOnFinish: true,
  leaveOnStop: true,
  youtubeDL: false,
  plugins: [new YtDlpPlugin(), new SpotifyPlugin()],
});

client.once('ready', () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    testServers: ['638145442307375139', '384186251693260800'],
    botOwners: ['346892063314542603', '176118270171021312'],
    typeScript: true,
    ignoreBots: true,
    ephemeral: false,
  }).setDefaultPrefix('.');
  client.user?.setPresence({
    activities: [{ name: 'with node.js', type: 'PLAYING' }],
    status: 'dnd',
  });
});

client.login(process.env.TOKEN);
