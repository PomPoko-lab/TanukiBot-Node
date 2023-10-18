const InitSequence = require('./classes/initSequence');

const init = new InitSequence();

global.client = init.client;
global.distube = init.distube;
