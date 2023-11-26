const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		console.log('yo');
		console.log(message);
	},
};