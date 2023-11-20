const InitSequence = require('./classes/initSequence');
const dotenv = require('dotenv');
const clientLogger = require('./utils/classes/ClientLogger');

const init = new InitSequence();

/**
 * The global discordjs Client
 * @global
 * @type {import('./classes/ExtendedClient')}
 */
// TODO: Fix this
// @ts-ignore
global.client = init.client;

/**
 * The global distube instance
 * @global
 * @type {import('distube').DisTube}
 */
// @ts-ignore
global.distube = init.distube;
import('node-fetch').then((fetch) => {
    // @ts-ignore
    global.fetch = fetch.default;
    import('pocketbase').then((db) => {
        dotenv.config();
        const Pocketbase = db.default;
        /**
         * The global PocketBase instance
         * @global
         * @type {import('pocketbase').default}
         */
        // @ts-ignore
        global.db = new Pocketbase(process.env.POCKETBASE_URL);  // Replace with correct URL
        clientLogger.log('Successfully connected to PocketBase');
    }).catch(error => {
        console.error("Error importing PocketBase:", error);
    });
}).catch(error => {
    console.error("Error importing fetch:", error);
});