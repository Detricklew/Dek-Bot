const { Events } = require('discord.js');
const { DekDB } = require('../../Dek-Modules/DataHandling/dekDB');
const { DBname } = require('../../config.json');

module.exports = {
	name: Events.ClientReady,
	execute() {
		try {
			DekDB.createDB();
			console.log(`${DBname} loaded successfully`);
		}
		catch (e) {
			console.error(e);
		}
	},
};