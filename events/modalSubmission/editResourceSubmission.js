const { Events } = require('discord.js');
const { DekDB } = require('../../Dek-Modules/DataHandling/dekDB');
const { dateParser } = require('../../Dek-Modules/DataHandling/dateParser');
const parser = require('../../Dek-Modules/DataHandling/resourceParser');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Checks to see if message starts with the command.
		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'Edit Resource') {
				await interaction.deferReply({ ephemeral: true });
				const submission = DekDB.getResourceById(interaction.guild, interaction.user, interaction.fields.getTextInputValue('id'));
				if (!submission) {
					interaction.editReply('Something went wrong...');
					return;
				}
				submission.name = interaction.fields.getTextInputValue('name');
				submission.directory = DekDB.getDirectoryById(submission.directory_id, interaction.guildId).name;
				submission.description = interaction.fields.getTextInputValue('description');
				submission.url = interaction.fields.getTextInputValue('url');
				submission.guildId = interaction.guildId;
				submission.userId = interaction.user.id;
				const dateRemoved = interaction.fields.getTextInputValue('dateRemoved');
				submission.roles = null;
				submission.dateRemoved = dateRemoved ? dateParser(dateRemoved) : null;
				try {
					parser(submission);
					const directory = DekDB.getDirectory(submission.directory, interaction.guildId);
					submission.directoryId = directory.id;
					DekDB.updateResources(submission);
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