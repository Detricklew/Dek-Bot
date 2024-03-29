const { ActionRowBuilder, TextInputBuilder, ModalBuilder } = require('@discordjs/builders');
const { TextInputStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	// establishes a new slash command
	data: new SlashCommandBuilder()
		.setName('addresource')
		.setDescription('Add a resource to a directory'),
	async execute(interaction) {
		// Modal is a popup form in Discord
		const modal = new ModalBuilder()
			.setCustomId('New Resource')
			.setTitle('Resource Form');
		// Establishing all of the text inputs with primary validation
		const directoryRow = new TextInputBuilder()
			.setCustomId('directory')
			.setLabel('Directory Name')
			.setPlaceholder('Input which directory this belongs to (Optional)')
			.setStyle(TextInputStyle.Short)
			.setRequired(false);
		const resourceNameRow = new TextInputBuilder()
			.setCustomId('name')
			.setLabel('Name of Resource')
			.setPlaceholder('Input the name of resource')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const descriptionRow = new TextInputBuilder()
			.setCustomId('description')
			.setLabel('Description')
			.setPlaceholder('Describe the resource')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);
		const resourceUrlRow = new TextInputBuilder()
			.setCustomId('url')
			.setLabel('Resource Link')
			.setPlaceholder('Must be an active url')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const dateRemovedRow = new TextInputBuilder()
			.setCustomId('dateRemoved')
			.setLabel('Input date to be removed')
			.setPlaceholder('(MM/DD/YYY) (optional)')
			.setStyle(TextInputStyle.Short)
			.setRequired(false);

		// text builder objects cannot be shown through the user that have to be set to a action row
		const firstActionRow = new ActionRowBuilder().addComponents(directoryRow);
		const secondActionRow = new ActionRowBuilder().addComponents(resourceNameRow);
		const thirdActionRow = new ActionRowBuilder().addComponents(descriptionRow);
		const fourthActionRow = new ActionRowBuilder().addComponents(resourceUrlRow);
		const fifthActionRow = new ActionRowBuilder().addComponents(dateRemovedRow);

		// Combining all action rows to set a modal to the user
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

		// send the modal to the user
		await interaction.showModal(modal);
	},
};