const { Events } = require('discord.js');
const { DekDB } = require('../../Dek-Modules/DataHandling/dekDB');

module.exports = {
	name: Events.GuildCreate,
	once: true,
	execute(guild) {
		DekDB.addGuild(guild);
		console.log(`added to ${guild.name}`);
	},
};