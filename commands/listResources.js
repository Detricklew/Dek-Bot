const { SlashCommandBuilder } = require('discord.js');
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');

module.exports = {
	// establishes a new slash command
	data: new SlashCommandBuilder()
		.setName('listresource')
		.setDescription('List all resources'),
	async execute(interaction) {
        const resources = DekDB.getResourcesByUser(interaction.guild, interaction.user);
        if(!resources) {
            interaction.reply({ content: 'You do not have any resources', emphemeral: true });
            return;
        }
        let listOfResources = 'id   name\n';
        resources.forEach((resource) =>{
            listOfResources += `${resource.id}  ${resource.name}\n`;
        })

        interaction.reply({ content: listOfResources, emphemeral: true });
	},
};