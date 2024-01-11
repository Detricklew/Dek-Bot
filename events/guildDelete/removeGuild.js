const { Events } = require('discord.js');
const { DekDB } = require('../../Dek-Modules/DataHandling/dekDB');

module.exports = {
	name: Events.GuildDelete,
	once: true,
	execute(guild) {
		DekDB.removeGuild(guild);
		console.log(`Removed from ${guild.name}`);
	},
};