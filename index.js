/* eslint-disable indent */
// Need these to read the folders and update events
require('app-module-path').addPath(__dirname);
const fs = require('node:fs');
const path = require('node:path');
// Sets the root of project for easier navigation
global.appRoot = path.resolve(__dirname);


// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
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

	client.commands = new Collection();
	const commandsPath = path.join(__dirname, 'commands');

	// Added this so I can sort the command folders by commands for better readability
	const commandFiles = findAllFiles(commandsPath, '.js');

	//  Collects all files and sets them to client commands
	for (const file of commandFiles) {
		const filePath = path.join(file.path, file.name);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}

// Searches the event directory and loads all events into the bot
const eventsPath = path.join(__dirname, 'events');

// Added this so I can sort the events folders by events for better readability
const eventFiles = findAllFiles(eventsPath, '.js');

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

	const selectedFiles = [];

	fs.readdirSync(currentPath, { withFileTypes: true }).forEach((item) => {

		if (!item.isDirectory()) {
			// If the file has the extension specified it gets added to selected Files
			if (item.name.endsWith(fileExtensionFilter)) selectedFiles.push({ name: item.name, path: item.path });
		}
		else if (item.isDirectory()) {
			// If file is a directory recursively call function
			const recurseArray = findAllFiles((item.path + '/' + item.name), fileExtensionFilter);
			selectedFiles.push(...recurseArray);
		}
	});

	return selectedFiles;
}