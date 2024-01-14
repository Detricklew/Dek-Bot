const { Events } = require('discord.js');
const directoryParser = require('../../Dek-Modules/DataHandling/directoryParser');
const { DekDB } = require('../../Dek-Modules/DataHandling/dekDB');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Checks to see if message starts with the command.
		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'Edit Directory') {
				await interaction.deferReply({ ephemeral: true });
				const submission = DekDB.getDirectoryById(interaction.fields.getTextInputValue('id'), interaction.guildId);
				submission.name = interaction.fields.getTextInputValue('name');
				submission.description = interaction.fields.getTextInputValue('description');
				submission.guildId = interaction.guildId;
				try {
					directoryParser(submission);
					DekDB.addDirectory(submission);
					await interaction.editReply('Submission successful');
				}
				catch (e) {
					console.error(e);
					await interaction.editReply(`Failed Submission: "${e}"`);
				}
				return;
			}
		}
    }
}