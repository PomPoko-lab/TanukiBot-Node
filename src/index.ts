import DisTube from 'distube';

// Util imports
import { IExtendedClient } from './Interface/IExtendedClient';
import { InitSequence } from './classes/InitSequence';
import { ClientLogger } from './classes/ClientLogger';

declare global {
	var client: IExtendedClient;
	var distube: DisTube;
	var clientLogger: ClientLogger;
}

const init = new InitSequence();

global.client = init.client;
global.distube = init.distube;
global.clientLogger = init.clientLogger;
