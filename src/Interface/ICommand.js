/**
 * @typedef {import('../classes/utils/ExtendedClient')} ExtendedClient
 * @typedef {import('distube').DisTube} DisTube
 * @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction
 *
 * @typedef {Object} ICommand
 * @property {import('discord.js').SlashCommandBuilder} name
 * @property {boolean} devOnly
 * @property {boolean} enabled
 * @property {(interaction: ChatInputCommandInteraction, client: ExtendedClient, distube: DisTube) => any} function
 */

module.exports = {};
