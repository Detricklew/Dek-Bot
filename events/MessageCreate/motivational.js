const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		// Checks to see if message starts with the command.
		if (message.content.startsWith('!Motivate')) {
			// Makes a request to an external API for a quote
			const response = await fetch('https://zenquotes.io/api/random');
			// Parses the quote into an javaScript object
			const data = await response.json();
			// Sends it back to the user
			message.reply(`"${data[0].q}"\n-${data[0].a}`).catch(console.error);
			return;
		}
	},
};