/* eslint-disable indent */
// Need these to read the folders and update events
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

/*  Create a new client instance
    GatewayIntentBits gives the bot the necessary permission to handle messages
*/
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ] });


// Searches the event directory and loads all events into the bot
const eventsPath = path.join(__dirname, 'events');
const eventFiles = [];

// Added this so I can sort the events folders by events for better readability
findAllFiles(eventsPath, '.js');

//  Collects all files and adds them to the client event listener
for (const file of eventFiles) {
	const filePath = path.join(file.path, file.name);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);

// Finds all files recursively throughout all directories in selected path

function findAllFiles(currentPath, fileExtensionFilter) {

	fs.readdirSync(currentPath, { withFileTypes: true }).forEach((item) => {

		if (!item.isDirectory()) {
			// If the file has the extension specified it gets added to eventFiles
			if (item.name.endsWith(fileExtensionFilter)) eventFiles.push({ name: item.name, path: item.path });
			return;
		}
		else if (item.isDirectory()) {
			// If file is a directory recursively call function
			findAllFiles((item.path + '/' + item.name), fileExtensionFilter);
			return;
		}
		return;
	});
}