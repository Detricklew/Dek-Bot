const { Events } = require('discord.js');
const directoryParser = require('../../Dek-Modules/DataHandling/directoryParser');
const { DekDB } = require('../../Dek-Modules/DataHandling/dekDB');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Checks to see if interaction is a modal submit
		if (interaction.isModalSubmit()) {
			// Ensures that interaction is new directory
			if (interaction.customId === 'New Directory') {
				await interaction.deferReply({ ephemeral: true });
				// Builds and object with all input parameters
				const submission = {};
				submission.name = interaction.fields.getTextInputValue('name');
				submission.description = interaction.fields.getTextInputValue('description');
				submission.guildId = interaction.guildId;
				// Attempts to parse the users input sends error to user iff unsuccessful
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
	},
};