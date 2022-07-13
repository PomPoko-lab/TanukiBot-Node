import DiscordJS, { Intents } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.once('ready', () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    testServers: ['638145442307375139', '384186251693260800'],
    botOwners: ['346892063314542603', '176118270171021312'],
    typeScript: true,
    ignoreBots: true,
  });
  client.user?.setPresence({
    activities: [{ name: 'with node.js', type: 'PLAYING' }],
    status: 'dnd',
  });
});

client.login(process.env.TOKEN);
