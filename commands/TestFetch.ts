import { ICommand } from 'wokcommands';
import GymDayModel from '../Models/GymDayModel';
import getGymDayEmbed from '../Views/getGymDayEmbed';

export default {
  category: 'Testing',
  description: 'For testing purposes. DO NOT USE',
  permissions: ['ADMINISTRATOR'],
  ownerOnly: true,
  hidden: true,
  slash: true,
  testOnly: true,
  guildOnly: true,
  callback: async ({ interaction, channel }) => {
    // Gets the next Gym Day, if all completed, resets all the false
    // and returns next day
    const getNextDay = async () => {
      let nextDay = await GymDayModel.findOne({
        userId: interaction.user.id,
        completed: false,
      });

      if (!nextDay) {
        await GymDayModel.updateMany(
          {
            userId: interaction.user.id,
            completed: true,
          },
          { completed: false }
        );

        return await GymDayModel.findOne({
          userId: interaction.user.id,
          completed: false,
        });
      }

      return nextDay;
    };

    try {
      await interaction.deferReply();
      const nextGymDay = await getNextDay();

      const embed = getGymDayEmbed(nextGymDay!);

      await interaction.editReply({
        content: `Your work out routine for today.`,
      });

      interaction.followUp({
        embeds: [embed],
      });
    } catch (err) {
      console.error(err);
    }
  },
} as ICommand;

/////////// Testing fetching of Holiday API
// export default {
//   category: 'Testing',
//   description: 'Fetches something for testing. DO NOT USE',
//   permissions: ['ADMINISTRATOR'],
//   ownerOnly: true,
//   hidden: true,
//   slash: true,
//   testOnly: true,
//   guildOnly: true,
//   callback: async ({ interaction, client }) => {
//     const API_URL = 'https://holidays.abstractapi.com/v1/?';
//     const API_KEY = `api_key=${process.env.HOLIDAY_API}`;
//     const country = 'US';
//     const currYear = new Date().getFullYear();
//     const currMonth = new Date().getMonth() + 1;
//     const currDay = new Date().getDate();
//     const days3 = +format(addDays(new Date(), 3), 'd');
//     const params = `&country=${country}&year=${currYear}&month=${currMonth}`;

//     const fetchURL = `${API_URL}${API_KEY}${params}`;
//     const channelID = '996561103054192741';

//     const getHoliday = async (day = currDay) => {
//       const response = await axios.get(`${fetchURL}&day=${day}`);
//       if (response.status !== 200) return;
//       return response.data;
//     };

//     const printHolidays = (holidaysArr: [], channel: TextChannel) => {
//       if (holidaysArr.length === 0) return;
//       holidaysArr.forEach(
//         (holiday: {
//           name: string;
//           description: string;
//           date: string;
//           type: string;
//         }) => {
//           // if (holiday.type !== 'public_holiday') return;

//           const embed = new MessageEmbed()
//             .setAuthor({
//               name: 'New Holiday',
//             })
//             .setColor('#0099ff')
//             .setTitle(holiday.name)
//             .setDescription(holiday.description)
//             .addFields({
//               name: 'Date',
//               value: holiday.date,
//             });
//           channel.send({ embeds: [embed] });
//         }
//       );
//     };

//     const holidayAnnouncer = async () => {
//       try {
//         // Text channel to insert holiday updates
//         const channel = (await client.channels.fetch(channelID)) as TextChannel;

//         // Daily Announcement
//         printHolidays(await getHoliday(), channel);

//         // Announcement 3 days from now
//         setTimeout(async () => {
//           printHolidays(await getHoliday(days3), channel);
//           console.log('Completed holidays fetch function');
//         }, 5000);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     await holidayAnnouncer();
//     await interaction.reply({
//       content: 'Sent info',
//       ephemeral: true,
//     });
//   },
// } as ICommand;
