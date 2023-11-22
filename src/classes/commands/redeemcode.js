/**
 * Type def/imports
 * @typedef {import('discord.js').BaseInteraction} BaseInteraction
 */

/**
 * @class
 * @classdesc Redeem Code command functionality
 */
const BaseCommand = require('./basecommand');
const { Client, Collection, StringSelectMenuInteraction } = require('discord.js');

class RedeemCode extends BaseCommand {
    constructor() {
        super();
    }

    /**
     * Parse a component action and execute it depending on the component's 'customid'.
     * @param {StringSelectMenuInteraction} interaction
     * @param {string} componentId 
     */
    parseComponentAction(interaction, componentId) {
        switch (componentId) {
            case 'setGameType':
                this.handleSelectGameType(interaction);
                break;
            default:
                break;
        }
    }

    /**
     * Handles the game type select menu when attempting to redeem a code. 
     * @param {StringSelectMenuInteraction} interaction 
     */
    handleSelectGameType(interaction) {
        const gameTypeID = interaction.values[0];
    }
};

module.exports = RedeemCode;