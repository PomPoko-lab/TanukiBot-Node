import { Client } from 'discord.js';

export default (client: Client) => {
  client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    message.content.includes('deez') && message.reply({ content: 'nuts' });
  });
};

export const config = {
  displayName: 'Replies with nuts after deez.',
};
