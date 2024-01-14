const { SlashCommandBuilder } = require('discord.js');
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');

module.exports = {
	// establishes a new slash command
	data: new SlashCommandBuilder()
		.setName('deletedirectories')
		.setDescription('Delete an directory')
        .addIntegerOption(option =>
            option.setName('id')
            .setDescription("The Id of the directory you want to delete")
            .setRequired(true)
            ),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try{
            DekDB.removeDirectory(interaction.options.getInteger('id'),interaction.guildId);
            await interaction.editReply("Deletion successful");

        }
        catch(e) {
            console.error(e);
            await interaction.editReply("There was a problem with the request");
        }
	},
};