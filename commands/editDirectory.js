const { ActionRowBuilder, TextInputBuilder, ModalBuilder } = require('@discordjs/builders');
const { TextInputStyle, SlashCommandBuilder } = require('discord.js');
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');

module.exports = {
	// establishes a new slash command
	data: new SlashCommandBuilder()
		.setName('editdirectory')
		.setDescription('Create a directory for resources')
		.addIntegerOption(option =>
			option.setName('id')
				.setDescription('The id of your directory')
				.setRequired(true),
		),
	async execute(interaction) {
		// Gets directory to edit
		const directory = DekDB.getDirectoryById(interaction.options.getInteger('id'), interaction.guildId);
		// If false throws error
		if (!directory) {
			await interaction.reply({ content: 'Directory does not exist', emphemeral: true });
			return;
		}
		// Modal is a popup form in Discord
		const modal = new ModalBuilder()
			.setCustomId('Edit Directory')
			.setTitle('Resource Form');
		// Establishing all of the text inputs with the value from the pulled directory
		const idRow = new TextInputBuilder()
			.setCustomId('id')
			.setLabel('(DO NOT CHANGE)')
			.setPlaceholder('Do you listen?')
			.setStyle(TextInputStyle.Short)
			.setValue(interaction.options.getInteger('id').toString())
			.setRequired(true);
		const directoryRow = new TextInputBuilder()
			.setCustomId('name')
			.setLabel('Directory Name')
			.setPlaceholder('Name of the directory')
			.setStyle(TextInputStyle.Short)
			.setValue(directory.name)
			.setRequired(false);
		const descriptionRow = new TextInputBuilder()
			.setCustomId('description')
			.setLabel('Description')
			.setPlaceholder('Describe your directory')
			.setStyle(TextInputStyle.Paragraph)
			.setValue(directory.description)
			.setRequired(true);
		// text builder objects cannot be shown through the user that have to be set to a action row
		const firstActionRow = new ActionRowBuilder().addComponents(idRow);
		const secondActionRow = new ActionRowBuilder().addComponents(directoryRow);
		const thirdActionRow = new ActionRowBuilder().addComponents(descriptionRow);

		// Combining all action rows to set a modal to the user
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

		// send the modal to the user
		await interaction.showModal(modal);
	},
};