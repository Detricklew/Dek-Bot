const { DekDB } = require('../../Dek-Modules/DataHandling/dekDB');

const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		// Allows me to index into the guilds that are stored on the server
		const guildHandler = new Set();
		// Calls the database to get all guilds stored and adds them to the set
		const guilds = DekDB.getGuilds();
		guilds.forEach((guild) => {
			guildHandler.add(guild.id.toString());
		});
		// If guild isn't in database add the guild
		client.guilds.cache.forEach((guild) => {
			if (guildHandler.has(guild.id.toString())) return;
			DekDB.addGuild(guild);
		});
	},
};