/* eslint-disable indent */
const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		console.log('yo');
		console.log(message);
        console.log(message.channelId);
	},
};