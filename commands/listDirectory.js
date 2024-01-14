const { SlashCommandBuilder } = require('discord.js');
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');

module.exports = {
	// establishes a new slash command
	data: new SlashCommandBuilder()
		.setName('listdirectories')
		.setDescription('List all directories you own'),
	async execute(interaction) {
        const directories = DekDB.getDirectoryByGuild(interaction.guildId);
        if(!directories) {
            interaction.reply({ content: 'No directories in this guild', emphemeral: true });
            return;
        }
        let listOfdirectories = 'id   name\n';
        directories.forEach((directory) =>{
            listOfdirectories += `${directory.id}  ${directory.name}\n`;
        })

        interaction.reply({ content: listOfdirectories, emphemeral: true });
	},
};