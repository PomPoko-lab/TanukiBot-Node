const Base = require('./base');

/**
 * @typedef {import('pocketbase').default} Pocketbase
 * @typedef {import('utils/classes/ClientLogger.js')} ClientLogger
 * @typedef {import('pocketbase').RecordModel} RecordModel
 */

/**
 * @class HonkaiAccounts
 * @extends {Base}
 */
class HonkaiAccounts extends Base {
	collection = 'honkai_accounts';

	constructor() {
		super();
		/** @type {Pocketbase} */
		this.db;
		/** @type {ClientLogger} */
		this.logger;
	}

	/**
	 * Get all accounts from a specific game type or all game types if
	 * none is specified
	 * @param {string} gameTypeID
	 * @param {string} fields
	 * @returns {Promise<RecordModel[]?>}
	 */
	async getAllAccounts(gameTypeID, fields) {
		let records = null;
		let filter = 'active=true';

		if (gameTypeID) {
			filter += ` && game_type.id ?= "${gameTypeID}"`;
		}

		try {
			records = await this.db.collection(this.collection).getFullList({
				filter,
				fields,
			});
		} catch (err) {
			// @ts-ignore
			const errorCode = err.code;
			if (errorCode !== 404) {
				this.logger.error(err);
			}
		}

		return records;
	}

	/**
	 * Get a discord user's account by their discord user ID
	 * @param {string} discordUserID
	 * @param {string} fields
	 * @returns {Promise<RecordModel?>}
	 */
	async getAccountByDiscordID(discordUserID, fields) {
		let record = null;

		try {
			record = await this.db
				.collection(this.collection)
				.getFirstListItem(
					`discord_user_id="${discordUserID}" && active=true`,
					{
						fields,
					}
				);
		} catch (err) {
			// @ts-ignore
			const errorCode = err.code;
			if (errorCode !== 404) {
				this.logger.error(err);
			}
		}

		return record;
	}

	/**
	 * Link a discord user to an account
	 * @param {string} gameTypeID
	 * @param {string} discordUserID
	 * @returns {Promise<RecordModel>}
	 */
	async createAccount(gameTypeID, discordUserID) {
		let record = null;

		try {
			record = await this.db.collection(this.collection).create({
				game_type: gameTypeID,
				discord_user_id: discordUserID,
				active: true,
			});
		} catch (err) {
			throw err;
		}

		return record;
	}
}

module.exports = HonkaiAccounts;
