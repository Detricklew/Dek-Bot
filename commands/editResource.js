const { ActionRowBuilder, TextInputBuilder, ModalBuilder } = require('@discordjs/builders');
const { TextInputStyle, SlashCommandBuilder } = require('discord.js');
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');

module.exports = {
	// establishes a new slash command
	data: new SlashCommandBuilder()
		.setName('editresource')
		.setDescription('Edit a resource to a directory')
		.addIntegerOption(option =>
			option.setName('id')
				.setDescription('The id number of your resource')
				.setRequired(true),
		),
	async execute(interaction) {
		const resource = DekDB.getResourceById(interaction.guild, interaction.user, interaction.options.getInteger('id'));
		if (!resource) {
			interaction.reply({ content: 'Resource does not exist', emphemeral: true });
			return;
		}
		// Modal is a popup form in Discord
		const modal = new ModalBuilder()
			.setCustomId('Edit Resource')
			.setTitle('Resource Form');
		// Establishing all of the text inputs with primary validation
		const idRow = new TextInputBuilder()
			.setCustomId('id')
			.setLabel('(DO NOT CHANGE)')
			.setPlaceholder('id of directory (DO NOT CHANGE)')
			.setStyle(TextInputStyle.Short)
			.setValue(resource.id.toString())
			.setRequired(false);
		const nameRow = new TextInputBuilder()
			.setCustomId('name')
			.setLabel('Name')
			.setPlaceholder('Name of the resource')
			.setValue(resource.name)
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const descriptionRow = new TextInputBuilder()
			.setCustomId('description')
			.setLabel('Description')
			.setPlaceholder('Describe the resource')
			.setValue(resource.description)
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);
		const resourceUrlRow = new TextInputBuilder()
			.setCustomId('url')
			.setLabel('Resource Link')
			.setPlaceholder('Must be an active url')
			.setStyle(TextInputStyle.Short)
			.setValue(resource.url)
			.setRequired(true);
		const dateRemovedRow = new TextInputBuilder()
			.setCustomId('dateRemoved')
			.setLabel('Input date to be removed')
			.setPlaceholder('(MM/DD/YYY) (optional)')
			.setStyle(TextInputStyle.Short)
			.setRequired(false);

		// text builder objects cannot be shown through the user that have to be set to a action row
		const firstActionRow = new ActionRowBuilder().addComponents(idRow);
		const secondActionRow = new ActionRowBuilder().addComponents(nameRow);
		const thirdActionRow = new ActionRowBuilder().addComponents(descriptionRow);
		const fourthActionRow = new ActionRowBuilder().addComponents(resourceUrlRow);
		const fifthActionRow = new ActionRowBuilder().addComponents(dateRemovedRow);

		// Combining all action rows to set a modal to the user
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

		// send the modal to the user
		await interaction.showModal(modal);
	},
};