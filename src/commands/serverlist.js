const dotenv = require('dotenv');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { commands } = require('../commandDescriptions.json');

const { ServerHandler } = require('../classes/ServerHandler');

const clientLogger = require('../utils/ClientLogger');

const {
    'GameServer - Server List': {
        name: commandName,
        description: commandDesc,
        devOnly,
        enabled,
    },
} = commands;

/**
 * Action to attach
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 * @param {import('../classes/ExtendedClient')} client 
 * @param {import('distube').DisTube} distube 
 * @returns 
 */
const callbackAction = async (interaction, client, distube) => {
    // temporary quick and dirty way to whitelist channels.
    const allowedChannels = ['996561103054192741', '1071547488424706119'];
    if (!allowedChannels.includes(interaction.channelId)) {
        return interaction.reply({
            ephemeral: true,
            content: 'Invalid channel.',
        });
    }

    try {
        await interaction.deferReply({
            ephemeral: true,
        });
        dotenv.config();
        const fileProcess = process.env.CONAN_PROCESS;
        // For docker implementation
        // const filePath = `${process.env.DOCUMENT_ROOT}${process.env.GAMESERVER_DIR}`;
        const filePath = `${process.cwd()}/${process.env.GAMESERVER_DIR}`;
        const fileExe = process.env.CONAN_SHORTCUT;

        if (fileProcess === undefined || filePath === undefined || fileExe === undefined) {
            return interaction.editReply('The server is not configured correctly, please contact an admin to check the config file.');
        }
        const serverHandler = new ServerHandler(
            fileProcess,
            filePath,
            fileExe
        );

        const BUTTON_TIMER = 15000;

        /**
         * Filter for the collector
         * @param {import('discord.js').ButtonInteraction} buttonInteraction 
         * @returns 
         */
        const filter = (buttonInteraction) => {
            return (
                buttonInteraction.customId === 'confirm' &&
                buttonInteraction.user.id === interaction.user.id
            );
        };
        const collector =
            interaction.channel?.createMessageComponentCollector({
                // @ts-ignore
                filter: filter,
                time: BUTTON_TIMER,
            });

        // If server is active, notify user and return
        if (await serverHandler.checkProcess(fileProcess)) {
            return interaction.editReply(
                `${fileProcess} has already started.`
            );
        }
        /**
         * @type {import('discord.js').ActionRowBuilder<ButtonBuilder>}
         */
        // @ts-ignore
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Start it')
                // @ts-ignore
                .setStyle(ButtonStyle.Primary)
        );

        interaction.editReply({
            content: `${fileProcess} is not currently active.`,
            components: [row],
        });

        collector?.on('collect', async (buttonInteraction) => {
            if (!(buttonInteraction.customId === 'confirm')) return;
            if (await serverHandler.executeFile()) {
                const user = interaction.user.toString();
                await interaction.channel?.send(
                    `${fileProcess} was started by ${user}. Please give it a moment to fully start up.`
                );
            } else {
                await interaction.channel?.send(
                    `An instance of the server was detected.`
                );
            }
            await buttonInteraction.deferUpdate();
            row.components[0].setDisabled(true);
            await interaction.editReply({
                content: 'Action completed.',
                components: [row],
            });
        });

        collector?.on('end', async (buttonInteraction) => {
            row.components[0].setDisabled(true);
            await interaction.editReply({
                content: 'Action no longer unavailable.',
                components: [row],
            });
        });
    } catch (err) {
        clientLogger.error(err);
        interaction.editReply('Something went wrong.');
    }
}

module.exports = {
    name: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(commandDesc),
    devOnly,
    enabled,
    function: callbackAction,
};