import dotenv from "dotenv";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import DisTube from "distube";
import { ServerHandler } from "../classes/ServerHandler";
import { IExtendedClient } from "../Interface/IExtendedClient";
import { ICommand } from "../Interface/ICommand";

import { commands } from "../commandDescriptions.json";

const {
    "GameServer - Server List": { name: commandName, description: commandDesc },
} = commands;

module.exports = {
    name: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(commandDesc),
    devOnly: false,
    function: async (
        interaction: ChatInputCommandInteraction,
        client: IExtendedClient,
        distube: DisTube
    ) => {
        // temporary quick and dirty way to whitelist channels.
        const allowedChannels = ["996561103054192741", "1071547488424706119"];
        if (!allowedChannels.includes(interaction.channelId)) {
            return interaction.reply({
                ephemeral: true,
                content: "Invalid channel.",
            });
        }

        try {
            await interaction.deferReply({
                ephemeral: true,
            });
            dotenv.config();
            const fileProcess = process.env.CONAN_PROCESS!;
            // For docker implementation
            // const filePath = `${process.env.DOCUMENT_ROOT}${process.env.GAMESERVER_DIR}`;
            const filePath = `${process.cwd()}/${process.env.GAMESERVER_DIR}`;
            const fileExe = process.env.CONAN_SHORTCUT!;
            const serverHandler = new ServerHandler(
                fileProcess,
                filePath,
                fileExe
            );

            const BUTTON_TIMER = 15000;

            const filter = (buttonInteraction: any) => {
                return (
                    buttonInteraction.customId === "confirm" &&
                    buttonInteraction.user.id === interaction.user.id
                );
            };
            const collector =
                interaction.channel?.createMessageComponentCollector({
                    filter: filter,
                    time: BUTTON_TIMER,
                });

            // If server is active, notify user and return
            if (await serverHandler.checkProcess(fileProcess)) {
                return interaction.editReply(
                    `${fileProcess} has already started.`
                );
            }
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("confirm")
                    .setLabel("Start it")
                    .setStyle(ButtonStyle.Primary)
            );

            interaction.editReply({
                content: `${fileProcess} is not currently active.`,
                components: [row],
            });

            collector?.on("collect", async (buttonInteraction) => {
                if (!(buttonInteraction.customId === "confirm")) return;
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
                    content: "Action completed.",
                    components: [row],
                });
            });

            collector?.on("end", async (buttonInteraction) => {
                row.components[0].setDisabled(true);
                await interaction.editReply({
                    content: "Action no longer unavailable.",
                    components: [row],
                });
            });
        } catch (err) {
            clientLogger.error(err);
            interaction.editReply("Something went wrong.");
        }
    },
} as ICommand;
