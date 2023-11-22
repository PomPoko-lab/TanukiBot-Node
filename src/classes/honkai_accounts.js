const Base = require('./base');

/**
 * @typedef {import('pocketbase').default} Pocketbase
 * @typedef {import('pocketbase').RecordModel[]} RecordModel[]
 * @typedef {import('pocketbase').RecordModel} RecordModel
 */

/**
 * @class HonkaiAccounts
 * @extends {Base}
 */
class HonkaiAccounts extends Base {
	/** @type {Pocketbase} */
	db;
	collection = 'honkai_accounts';

	constructor() {
		super();
	}

	/**
	 * Get all accounts from a specific game type or all game types if
	 * none is specified
	 * @param {string} gameTypeID
	 * @param {string} fields
	 * @returns {Promise<RecordModel[]>}
	 */
	getAllAccounts(gameTypeID, fields) {
		let filter = 'active=true';

		if (gameTypeID) {
			filter += ` && game_type.id ?= "${gameTypeID}"`;
		}

		return this.db.collection(this.collection).getFullList({
			filter,
			fields,
		});
	}

	/**
	 * Get a discord user's account by their discord user ID
	 * @param {string} discordUserID
	 * @param {string} fields
	 * @returns {Promise<RecordModel>}
	 */
	getAccountByDiscordID(discordUserID, fields) {
		return this.db
			.collection(this.collection)
			.getFirstListItem(
				`discord_user_id="${discordUserID} && active=true"`,
				{
					fields,
				}
			);
	}

	/**
	 * Link a discord user to an account
	 * @param {string} gameTypeID
	 * @param {string} discordUserID
	 * @returns
	 */
	createAccount(gameTypeID, discordUserID) {
		return this.db.collection(this.collection).create({
			game_type: gameTypeID,
			discord_user_id: discordUserID,
			active: true,
		});
	}
}
