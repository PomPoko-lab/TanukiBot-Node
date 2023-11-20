const {
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	StringSelectMenuInteraction,
	hideLinkEmbed,
	bold
} = require('discord.js');
const { commands } = require('../commandDescriptions.json');

const clientLogger = require('../utils/classes/ClientLogger');

const {
	'System - Redeem Code': { name: commandName, description: commandDesc, devOnly, enabled },
} = commands;

/**
 * Action to attach
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('../classes/ExtendedClient')} client
 * @param {import('distube').DisTube} _
 * @param {import('pocketbase').default} db
 * @returns
 */
const callbackAction = async (interaction, client, _, db) => {
	const redemptionCode = interaction.options.getString('code');
	if (!redemptionCode) {
		return interaction.reply('No redemption code provided.');
	}

	try {
		await interaction.deferReply();

		const gamesList = await db.collection('honkai_games').getFullList({
			sort: '-created',
		});

		if (gamesList.length === 0) {
			return interaction.editReply('No games found to redeem codes for.');
		}

		const gameTypeSelectComponent = new StringSelectMenuBuilder()
			.setCustomId('game_type')
			.setPlaceholder('Select a game to redeem code for')
			.addOptions(gamesList.map(game => new StringSelectMenuOptionBuilder()
				.setLabel(game.name)
				.setValue(game.id))
			);

		const actionRow = new ActionRowBuilder()
			.addComponents(gameTypeSelectComponent);

		const selectGameTypeReply = await interaction.editReply({
			content: 'Please select a game to redeem code for',
			// @ts-ignore - We don't need to define the Component type in the ActionRowBuilder
			components: [actionRow],
		});

		/**
		 * @type {StringSelectMenuInteraction}
		 */
		// @ts-ignore
		const userGameTypeResponse = await selectGameTypeReply.awaitMessageComponent({
			filter: (i) => i.user.id === interaction.user.id,
			time: 60000,
		});

		if (!userGameTypeResponse) {
			return interaction.editReply('No game type selected.');
		}

		const selectedGameType = userGameTypeResponse.values[0];
		const selectedGameFromList = gamesList.find(game => game.id === selectedGameType);

		if (!selectedGameFromList) {
			return interaction.editReply('Invalid game type selected.');
		}

		const redemptionUrl = new URL(selectedGameFromList.code_redeem_url);
		redemptionUrl.searchParams.append('code', redemptionCode);

		let existingRecord = {};
		// TODO: Sanitize some user inputs
		try {
			existingRecord = await db.collection('honkai_game_codes').create({
				game_type: selectedGameType,
				redemption_code: redemptionCode,
			})
		} catch (err) {
			clientLogger.error(err);
			clientLogger.error('Code probably already exists in the database.');
		}

		if (Object.keys(existingRecord).length === 0) {
			existingRecord = await db.collection('honkai_game_codes').getFirstListItem(`redemption_code="${redemptionCode}"`, {
				expand: 'redeemed_users',
			})
		}
		/**
		 * @type {string[]}
		 */
		// @ts-ignore
		const redeemed_users = existingRecord.expand?.redeemed_users.map(userRecord => userRecord.discord_user_id) || [];
		console.log(redeemed_users);
		interaction.editReply(`${bold('Redemption URL:')}\n${hideLinkEmbed(redemptionUrl.toString())}`);
	} catch (err) {
		clientLogger.error(err);
	}
};

module.exports = {
	name: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription(commandDesc)
		.addStringOption((option) =>
			option.setName('code').setDescription('Redemption Code').setRequired(true)
		),
	// .addStringOption((option) =>
	// 	option.setName('code').setDescription('Redemption Code').setRequired(true)
	// ),
	devOnly,
	enabled,
	function: callbackAction,
};
