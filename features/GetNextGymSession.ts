import getNextGymSession from '../utils/workout/getNextGymSession';
import { TextChannel, Client } from 'discord.js';
import { CronJob } from 'cron';

export default async (client: Client) => {
  const GUILD_ID = '638145442307375139';
  const CHANNEL_ID = '996561103054192741';
  const USER_ID = '346892063314542603';

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = (await guild.channels.fetch(CHANNEL_ID)) as TextChannel;
    const user = (await guild.members.fetch(USER_ID)).user;

    // Triggers every other day at 11AM
    new CronJob(
      '0 0 11 1/2 * *',
      function () {
        getNextGymSession(user, channel);
      },
      null,
      true,
      'America/Monterrey'
    );
  } catch (err) {
    console.error(err);
  }
};
