const clientLogger = require('../utils/classes/ClientLogger');

/**
 * @class Base
 * @abstract
 */
class Base {
	constructor() {
		this.logger = clientLogger;
		this.db = global.db;
	}
}

module.exports = Base;
