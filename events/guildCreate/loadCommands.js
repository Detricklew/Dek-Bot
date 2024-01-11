const { Events } = require('discord.js');
const { REST, Routes } = require('discord.js');
const { token, clientId } = require('../../config.json');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: Events.GuildCreate,
	execute(guild) {
		const commands = [];
		// Grab all the command folders from the commands directory you created earlier
		const commandsPath = path.join(__dirname, '..', '..', 'commands');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


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
				console.log(`Started refreshing ${commands.length} application (/) commands in ${guild.name}.`);
				// The put method is used to fully refresh all commands in the guild with the current set
				const data = await rest.put(
					Routes.applicationGuildCommands(clientId, guild.id),
					{ body: commands },
				);

				console.log(`Successfully reloaded ${data.length} application (/) commands in ${guild.name}.`);
			}
			catch (error) {
				// And of course, make sure you catch and log any errors!
				console.error(error);
			}
		})();
	},
};