const { ActionRowBuilder, TextInputBuilder, ModalBuilder } = require('@discordjs/builders');
const { TextInputStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	// establishes a new slash command
	data: new SlashCommandBuilder()
		.setName('adddirectory')
		.setDescription('Create a directory for resources'),
	async execute(interaction) {
		// Modal is a popup form in Discord
		const modal = new ModalBuilder()
			.setCustomId('New Directory')
			.setTitle('Resource Form');
		// Establishing all of the text inputs with primary validation
		const directoryRow = new TextInputBuilder()
			.setCustomId('name')
			.setLabel('Directory Name')
			.setPlaceholder('Name Directory')
			.setStyle(TextInputStyle.Short)
			.setRequired(false);
		const descriptionRow = new TextInputBuilder()
			.setCustomId('description')
			.setLabel('Description')
			.setPlaceholder('describe directory')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);
		const resourceUrlRow = new TextInputBuilder()
			.setCustomId('channelexclusive')
			.setLabel('channel')
			.setMaxLength(1)
			.setPlaceholder('directory tied to this channel? Y/N')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		// text builder objects cannot be shown through the user that have to be set to a action row
		const firstActionRow = new ActionRowBuilder().addComponents(directoryRow);
		const secondActionRow = new ActionRowBuilder().addComponents(descriptionRow);
		const thirdActionRow = new ActionRowBuilder().addComponents(resourceUrlRow);

		// Combining all action rows to set a modal to the user
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

		// send the modal to the user
		await interaction.showModal(modal);
	},
};