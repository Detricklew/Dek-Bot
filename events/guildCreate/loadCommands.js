const { Events } = require('discord.js');
const { REST, Routes } = require('discord.js');
const { token, clientId } = require('../../config.json');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: Events.GuildCreate,
	execute(guild) {
		const commands = [];
		// Sets path to commands folder
		const commandsPath = path.join(__dirname, '..', '..', 'commands');
		// Reads through the commands folder and selects only files that end in js
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		// Goes through each entry in command files array and adds it to a json to send to discord API
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
			}
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}

		// Construct and prepare an instance of the REST module
		const rest = new REST().setToken(token);

		(async () => {
			try {
				// Loads all commands into newly added guild
				console.log(`Started refreshing ${commands.length} application (/) commands in ${guild.name}.`);
				const data = await rest.put(
					Routes.applicationGuildCommands(clientId, guild.id),
					{ body: commands },
				);

				console.log(`Successfully reloaded ${data.length} application (/) commands in ${guild.name}.`);
			}
			catch (error) {
				console.error(error);
			}
		})();
	},
};