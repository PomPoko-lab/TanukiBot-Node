const Base = require('./base');

/**
 * @typedef {import('pocketbase').default} Pocketbase
 * @typedef {import('utils/classes/ClientLogger.js')} ClientLogger
 * @typedef {import('pocketbase').RecordModel} RecordModel
 */

/**
 * @class HonkaiGameCodes
 * @extends {Base}
 */
class HonkaiGameCodes extends Base {
	collection = 'honkai_game_codes';

	constructor() {
		super();
		/** @type {Pocketbase} */
		this.db;
		/** @type {ClientLogger} */
		this.logger;
	}

	/**
	 * Removes whitespace and converts to uppercase for consistency
	 * @param {string} code
	 * @returns string
	 */
	formatCode(code) {
		return code.trim().toUpperCase();
	}

	async addGameCode(gameTypeID, code) {
		code = this.formatCode(code);

		/** @type {RecordModel} */
		let newCodeRecord = [];
		try {
			newCodeRecord = await this.db.collection(this.collection).create({
				game_type: gameTypeID,
				redemption_code: code,
			});
		} catch (err) {
			this.logger.error(err);
		}
		return newCodeRecord;
	}

	/**
	 * Retrieves a game code from the database
	 * @param {string} gameTypeID
	 * @param {string} code
	 * @returns {Promise<RecordModel?>}
	 */
	async getGameCode(gameTypeID, code) {
		code = this.formatCode(code);

		/** @type {RecordModel?} */
		let codeRecord = null;

		try {
			codeRecord = await this.db
				.collection(this.collection)
				.getFirstListItem(
					`game_type="${gameTypeID}" && redemption_code="${code}"`
				);
		} catch (err) {
			this.logger.error(err);
		}
		return codeRecord;
	}

	// /**
	//  * Get all accounts from a specific game type or all game types if
	//  * none is specified
	//  * @param {string} gameTypeID
	//  * @param {string} fields
	//  * @returns {Promise<RecordModel[]>}
	//  */
	// getAllAccounts(gameTypeID, fields) {
	// 	let filter = 'active=true';

	// 	if (gameTypeID) {
	// 		filter += ` && game_type.id ?= "${gameTypeID}"`;
	// 	}

	// 	return this.db.collection(this.collection).getFullList({
	// 		filter,
	// 		fields,
	// 	});
	// }
}

module.exports = HonkaiGameCodes;
