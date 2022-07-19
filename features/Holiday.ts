import { Client, TextChannel, MessageEmbed } from 'discord.js';
import axios from 'axios';
import { CronJob } from 'cron';
import { format, addDays } from 'date-fns';

export default async (client: Client) => {
  const API_URL = 'https://holidays.abstractapi.com/v1/?';
  const API_KEY = `api_key=${process.env.HOLIDAY_API}`;
  const country = 'US';
  const currYear = new Date().getFullYear();
  const currMonth = new Date().getMonth() + 1;
  const currDay = +format(addDays(new Date(), 1), 'd');
  const days3 = +format(addDays(new Date(), 4), 'd');
  const params = `&country=${country}&year=${currYear}&month=${currMonth}`;

  const fetchURL = `${API_URL}${API_KEY}${params}`;

  // Channel ID to send notification
  const channelID = '638145442307375143';

  const getHoliday = async (day = currDay) => {
    const response = await axios.get(`${fetchURL}&day=${day}`);
    if (response.status !== 200) return;
    return response.data;
  };

  const printHolidays = (holidaysArr: [], channel: TextChannel) => {
    if (holidaysArr.length === 0) return;
    holidaysArr.forEach(
      (holiday: {
        name: string;
        description: string;
        date: string;
        type: string;
      }) => {
        // if (holiday.type !== 'public_holiday') return;

        const embed = new MessageEmbed()
          .setAuthor({
            name: 'New Holiday',
          })
          .setColor('#0099ff')
          .setTitle(holiday.name)
          .setDescription(holiday.description)
          .addFields({
            name: 'Date',
            value: holiday.date,
          });
        channel.send({ embeds: [embed] });
      }
    );
  };

  const holidayAnnouncer = async () => {
    try {
      // Text channel to insert holiday updates
      const channel = (await client.channels.fetch(channelID)) as TextChannel;

      // Daily Announcement
      printHolidays(await getHoliday(), channel);

      // Announcement 3 days from now
      setTimeout(async () => {
        printHolidays(await getHoliday(days3), channel);
        console.log('Completed holidays fetch function');
      }, 5000);
    } catch (err) {
      console.error(err);
    }
  };

  new CronJob(
    '00 00 00 * * *',
    holidayAnnouncer,
    null,
    true,
    'America/Monterrey'
  );
};

export const config = {
  displayName: 'Holiday Announcer',
};
