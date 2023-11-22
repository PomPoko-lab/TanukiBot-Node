const {
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	StringSelectMenuInteraction,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
} = require('discord.js');
const { commands } = require('../commandDescriptions.json');

const clientLogger = require('../utils/classes/ClientLogger');

const {
	'System - Redeem Code': {
		name: commandName,
		description: commandDesc,
		devOnly,
		enabled,
	},
} = commands;

let redemptionCode = '';
let selectedGameType = '';
/**
 * @type {import('discord.js').User[]}
 */
let allGameTypeDiscordUsers = [];

/**
 * @type {import('pocketbase').RecordModel}}
 */
let existingCodeRecord;

/**
 * @type {string[]}
 */
let redeemed_users = [];

let totalUsers = 0;
let totalRedeemedUsers = 0;

/**
 *
 * @param {import('../classes/utils/ExtendedClient')} client
 * @returns
 */
const buildMainResponseEmbed = async (client) => {
	// @ts-ignore
	const db = global.db;
	let value = '';

	// TODO: Sanitize some user inputs
	existingCodeRecord = await db
		.collection('honkai_game_codes')
		.getFirstListItem(`redemption_code="${redemptionCode}"`, {
			expand: 'redeemed_users',
		});

	if (Object.keys(existingCodeRecord).length === 0) {
		existingCodeRecord = await db.collection('honkai_game_codes').create({
			game_type: selectedGameType,
			redemption_code: redemptionCode,
		});
	}

	redeemed_users = existingCodeRecord.expand?.redeemed_users.map(
		(/** @type {import('discord.js').User} */ userRecord) =>
			// @ts-ignore
			userRecord.discord_user_id
	);

	/**
	 * @type {import('pocketbase').RecordModel[]}
	 */
	// honkai_accounts.getAllaCcounts(selectedGameType, 'discord_user_id');
	const allGameTypeUsers = await db
		.collection('honkai_accounts')
		.getFullList({
			filter: `game_type.id ?= "${selectedGameType}" && active=true`,
			fields: 'discord_user_id',
		});

	allGameTypeDiscordUsers = await Promise.all(
		allGameTypeUsers.map(
			async (user) => await client.users.fetch(user.discord_user_id)
		)
	);

	totalUsers = allGameTypeUsers.length;
	totalRedeemedUsers = redeemed_users.length;

	allGameTypeDiscordUsers.forEach((user) => {
		const userHasRedeemed = redeemed_users.includes(user.id);

		if (userHasRedeemed) {
			value += `- ${user.tag}\n`;
		} else {
			value += `- ${user.tag} - \`Not Redeemed\`\n`;
		}
	});

	return {
		name: `Redeemed by [${totalRedeemedUsers}/${totalUsers}] Users:`,
		value,
	};
};

/**
 * Action to attach
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('../classes/utils/ExtendedClient')} client
 * @param {import('distube').DisTube} _
 * @param {import('pocketbase').default} db
 * @returns
 */
const callbackAction = async (interaction, client, _, db) => {
	redemptionCode = interaction.options.getString('code') ?? '';
	if (!redemptionCode) {
		return interaction.reply('No redemption code provided.');
	}

	redemptionCode = redemptionCode.trim().toUpperCase();
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
			.addOptions(
				gamesList.map((game) =>
					new StringSelectMenuOptionBuilder()
						.setLabel(game.name)
						.setValue(game.id)
				)
			);

		const actionRow = new ActionRowBuilder().addComponents(
			gameTypeSelectComponent
		);

		const selectGameTypeReply = await interaction.editReply({
			content: 'Please select a game to redeem code for',
			// @ts-ignore - We don't need to define the Component type in the ActionRowBuilder
			components: [actionRow],
		});

		/**
		 * @type {StringSelectMenuInteraction}
		 */
		// @ts-ignore
		const userGameTypeResponse =
			await selectGameTypeReply.awaitMessageComponent({
				filter: (i) => {
					i.deferUpdate();
					return i.user.id === interaction.user.id;
				},
				time: 60000,
			});

		if (!userGameTypeResponse) {
			return interaction.editReply('No game type selected.');
		}

		selectedGameType = userGameTypeResponse.values[0];
		const selectedGameFromList = gamesList.find(
			(game) => game.id === selectedGameType
		);

		if (!selectedGameFromList) {
			return interaction.editReply('Invalid game type selected.');
		}

		const redemptionUrl = new URL(selectedGameFromList.code_redeem_url);
		redemptionUrl.searchParams.append('code', redemptionCode);

		const embedFields = await buildMainResponseEmbed(client);
		const replyEmbed = new EmbedBuilder()
			.setTitle(`[${selectedGameFromList.name}] Redemption Code`)
			.setDescription(`Redemption Code: ${redemptionCode}`)
			.setURL(redemptionUrl.toString())
			.addFields(embedFields);

		const markRedeemedBtn = new ButtonBuilder()
			.setCustomId('mark_redeemed')
			.setLabel('Mark as Redeemed')
			.setStyle(ButtonStyle.Success);

		actionRow.setComponents(markRedeemedBtn);

		const userMarkRedeemResponse = await interaction.editReply({
			content: '',
			embeds: [replyEmbed],
			// @ts-ignore - We don't need to define the Component type in the ActionRowBuilder
			components: [actionRow],
		});

		const markRedeemedCollector =
			userMarkRedeemResponse.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

		markRedeemedCollector.on('collect', async (btnInteraction) => {
			// TODO: Refactor this to make a new fetch request to get the latest record
			// Just break buildMainResponseEmbed up since it's doing too much
			const userHasAlreadyRedeemed = redeemed_users.includes(
				btnInteraction.user.id
			);
			if (userHasAlreadyRedeemed) {
				const btnReply = await btnInteraction.reply({
					content: 'You have already redeemed this code.',
					ephemeral: true,
				});

				setTimeout(() => {
					btnReply.delete();
				}, 10000);
				return;
			}
			let replyContent = '';
			/**
			 * @type {string}
			 */
			// @ts-ignore
			const redemptionCodeId = existingCodeRecord.id;
			// @ts-ignore
			const redemptionCodeGameType = existingCodeRecord.game_type;
			let existingUserRecord;
			try {
				// honkai_accounts.getAccountByDiscordID(btnInteraction.user.id, 'id, game_type');
				existingUserRecord = await db
					.collection('honkai_accounts')
					.getFirstListItem(
						`discord_user_id="${btnInteraction.user.id}" && active=true`,
						{
							fields: 'id, game_type',
						}
					);

				if (
					!existingUserRecord.game_type.includes(
						redemptionCodeGameType
					)
				) {
					// honkai_accounts.getaccountbydiscordid(btninteraction.user.id, 'id, game_type');
					await db
						.collection('honkai_accounts')
						.update(existingUserRecord.id, {
							game_type: [
								...existingUserRecord.game_type,
								redemptionCodeGameType,
							],
						});
				}
			} catch (err) {
				// honkai_accounts.createaccount(redemptioncodegametype, btninteraction.user.id);
				existingUserRecord = await db
					.collection('honkai_accounts')
					.create({
						discord_user_id: btnInteraction.user.id,
						game_type: [redemptionCodeGameType],
						active: true,
					});
				replyContent += `Your discord account has been linked to a ${selectedGameFromList.name} account.\n`;
			}

			await db.collection('honkai_game_codes').update(redemptionCodeId, {
				'redeemed_users+': existingUserRecord.id,
			});

			replyContent += `Successfully marked as redeemed.`;

			const btnReply = await btnInteraction.reply({
				content: replyContent,
				ephemeral: true,
			});

			setTimeout(() => {
				btnReply.delete();
			}, 10000);

			redeemed_users.push(btnInteraction.user.id);
			totalRedeemedUsers++;

			let embedFields = await buildMainResponseEmbed(client);
			replyEmbed.setFields(embedFields);

			userMarkRedeemResponse.edit({
				embeds: [replyEmbed],
				// @ts-ignore - We don't need to define the Component type in the ActionRowBuilder
				components: [actionRow],
			});
		});
	} catch (err) {
		clientLogger.error(err);
	}
};

module.exports = {
	name: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription(commandDesc)
		.addStringOption((option) =>
			option
				.setName('code')
				.setDescription('Redemption Code')
				.setRequired(true)
		),
	devOnly,
	enabled,
	function: callbackAction,
};
