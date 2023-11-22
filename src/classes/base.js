const dotenv = require('dotenv');

/**
 * @class Base
 * @abstract
 */
class Base {
	constructor() {
		dotenv.config();
		import('node-fetch')
			.then((fetch) => {
				// @ts-ignore
				global.fetch = fetch.default;
				import('pocketbase')
					.then((db) => {
						dotenv.config();
						const Pocketbase = db.default;
						/**
						 * The global PocketBase instance
						 * @global
						 * @type {import('pocketbase').default}
						 */
						this.db = new Pocketbase(process.env.POCKETBASE_URL); // Replace with correct URL
					})
					.catch((error) => {
						console.error('Error importing PocketBase:', error);
					});
			})
			.catch((error) => {
				console.error('Error importing fetch:', error);
			});
	}
}
