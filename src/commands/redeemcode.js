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
const _HonkaiGameCodes = require('../classes/honkaigamecodes');
const _HonkaiAccounts = require('../classes/honkaiaccounts');

const {
	'System - Redeem Code': {
		name: commandName,
		description: commandDesc,
		devOnly,
		enabled,
	},
} = commands;

// let redemptionCode = '';
// let selectedGameType = '';
/**
 * @type {import('discord.js').User[]}
 */
// let allGameTypeDiscordUsers = [];

/**
 * @type {import('pocketbase').RecordModel?}}
 */
// let existingCodeRecord;

/**
 * @type {string[]}
 */
// let redeemed_users = [];

// let totalUsers = 0;
// let totalRedeemedUsers = 0;

/**
 * Creates the main embed response
 * @param {import('../classes/utils/ExtendedClient')} client
 * @param {import('pocketbase').RecordModel?} existingCodeRecord
 * @returns
 */
const buildMainResponseEmbed = async (client, existingCodeRecord) => {
	// @ts-ignore
	const db = global.db;
	let value = '';

	const redeemed_users = existingCodeRecord?.redeemed_users ?? [];
	const gameTypeId = existingCodeRecord?.game_type;

	/**
	 * @type {import('pocketbase').RecordModel[]}
	 */
	// honkai_accounts.getAllaCcounts(selectedGameType, 'discord_user_id');
	const allGameTypeUsers = await db
		.collection('honkai_accounts')
		.getFullList({
			filter: `game_type.id ?= "${gameTypeId}" && active=true`,
			fields: 'id, discord_user_id',
		});

	const allGameTypeDiscordUsers = await Promise.all(
		allGameTypeUsers.map(
			async (user) => await client.users.fetch(user.discord_user_id)
		)
	);

	const totalUsers = allGameTypeUsers.length;
	const totalRedeemedUsers = redeemed_users.length;

	allGameTypeDiscordUsers.forEach((user) => {
		const userRecordID = allGameTypeUsers.find(
			(userRecord) => userRecord.discord_user_id === user.id
		)?.id;
		const userHasRedeemed = redeemed_users.includes(userRecordID) ?? false;

		if (userHasRedeemed) {
			value += `- ${user.tag}\n`;
		} else {
			value += `- ${user.tag} - \`Not Redeemed\`\n`;
		}
	});

	if (!value) {
		return {};
	}

	return {
		name: `Redeemed by [${totalRedeemedUsers}/${totalUsers}] Users:`,
		value: value,
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
	let redemptionCode = interaction.options.getString('code') ?? '';
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

		const selectedGameType = userGameTypeResponse.values[0];
		const selectedGameFromList = gamesList.find(
			(game) => game.id === selectedGameType
		);

		if (!selectedGameFromList) {
			return interaction.editReply('Invalid game type selected.');
		}

		const redemptionUrl = new URL(selectedGameFromList.code_redeem_url);
		redemptionUrl.searchParams.append('code', redemptionCode);

		const replyEmbed = new EmbedBuilder()
			.setTitle(`[${selectedGameFromList.name}] Redemption Code`)
			.setDescription(`Redemption Code: ${redemptionCode}`)
			.setURL(redemptionUrl.toString());

		// // TODO: Sanitize some user inputs
		const HonkaiGameCodes = new _HonkaiGameCodes();
		let existingCodeRecord = await HonkaiGameCodes.getGameCode(
			selectedGameFromList.id,
			redemptionCode
		);

		if (!existingCodeRecord) {
			existingCodeRecord = await HonkaiGameCodes.addGameCode(
				selectedGameFromList.id,
				redemptionCode
			);
		}

		const embedFields = await buildMainResponseEmbed(
			client,
			existingCodeRecord
		);

		if (Object.keys(embedFields).length > 0) {
			replyEmbed.addFields(embedFields);
		}

		const markRedeemedBtn = new ButtonBuilder()
			.setCustomId(redemptionCode)
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
			const redemptionCode = btnInteraction.customId;
			const userDiscordID = btnInteraction.user.id;
			const HonkaiGameCodes = new _HonkaiGameCodes();
			const HonkaiAccounts = new _HonkaiAccounts();

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
				const existingCodeRecord = await HonkaiGameCodes.getGameCode(
					selectedGameFromList.id,
					redemptionCode
				);

				if (!existingCodeRecord) {
					btnInteraction.reply({
						content: 'No redemption code found.',
						ephemeral: true,
					});
					return;
				}

				existingUserRecord = await HonkaiAccounts.getAccountByDiscordID(
					userDiscordID,
					'id, game_type'
				);

				if (!existingUserRecord) {
					existingUserRecord = await HonkaiAccounts.createAccount(
						redemptionCodeGameType,
						userDiscordID
					);

					replyContent += `Your discord account has been linked to a ${selectedGameFromList.name} account.\n`;
				}

				if (
					!existingUserRecord.game_type.includes(
						redemptionCodeGameType
					)
				) {
					await db
						.collection('honkai_accounts')
						.update(existingUserRecord.id, {
							game_type: [
								...existingUserRecord.game_type,
								redemptionCodeGameType,
							],
						});
				}

				const userHasAlreadyRedeemed =
					existingCodeRecord.redeemed_users.includes(
						existingUserRecord.id
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

				await db
					.collection('honkai_game_codes')
					.update(redemptionCodeId, {
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

				existingCodeRecord?.redeemed_users.push(existingUserRecord.id);

				let embedFields = await buildMainResponseEmbed(
					client,
					existingCodeRecord
				);
				replyEmbed.setFields(embedFields);

				userMarkRedeemResponse.edit({
					embeds: [replyEmbed],
					// @ts-ignore - We don't need to define the Component type in the ActionRowBuilder
					components: [actionRow],
				});
			} catch (err) {
				clientLogger.error(err);
				btnInteraction.reply({
					content: 'An error occurred. Please try again.',
					ephemeral: true,
				});
			}
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
