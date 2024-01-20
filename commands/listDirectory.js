const { SlashCommandBuilder } = require('discord.js');
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');

module.exports = {
	// establishes a new slash command
	data: new SlashCommandBuilder()
		.setName('listdirectories')
		.setDescription('List all directories you own'),
	async execute(interaction) {
		// Makes a pull to grab all directories tied to guild
		const directories = DekDB.getDirectoryByGuild(interaction.guildId);
		if (!directories) {
			interaction.reply({ content: 'No directories in this guild', emphemeral: true });
			return;
		}
		let listOfDirectories = 'id   name\n';
		directories.forEach((directory) => {
			listOfDirectories += `${directory.id}  ${directory.name}\n`;
		}),

		interaction.reply({ content: listOfDirectories, emphemeral: true });
	},
};