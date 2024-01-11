const { Events } = require('discord.js');
const { DekDB } = require('../../Dek-Modules/DataHandling/dekDB');
const parser = require('../../Dek-Modules/DataHandling/resourceParser');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Checks to see if message starts with the command.
		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'New Resource') {
				await interaction.deferReply({ ephemeral: true });
				const submission = {};
				submission.directory = interaction.fields.getTextInputValue('directory');
				submission.description = interaction.fields.getTextInputValue('description');
				submission.url = interaction.fields.getTextInputValue('url');
				submission.guildId = interaction.guildId;
				submission.userId = interaction.user.id;
				const roles = interaction.fields.getTextInputValue('roles');
				const dateRemoved = interaction.fields.getTextInputValue('dateRemoved');
				console.log(roles);
				submission.roles = roles ? roles : null;
				submission.dateRemoved = dateRemoved ? dateRemoved : null;
				try {
					parser(submission);
					const directory = DekDB.getDirectory(submission.directory);
					submission.directoryId = directory.id;
					DekDB.addResource(submission);
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