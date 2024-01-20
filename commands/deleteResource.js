const { SlashCommandBuilder } = require('discord.js');
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');

module.exports = {
	// establishes a new slash command
	data: new SlashCommandBuilder()
		.setName('deleteresource')
		.setDescription('Delete a resource')
		.addIntegerOption(option =>
			option.setName('id')
				.setDescription('The Id of the resource you want to delete')
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		// Tries to delete resource if there is an issue notifies user
		try {
			DekDB.removeResource(interaction.options.getInteger('id'), interaction.user.id, interaction.guildId);
			await interaction.editReply('Deletion successful');

		}
		catch (e) {
			console.error(e);
			await interaction.editReply('There was a problem with the request');
		}
	},
};