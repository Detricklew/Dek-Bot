const { DekDB } = require('../../Dek-Modules/DataHandling/dekDB');

const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const dbUsers = DekDB.getUsers();
		const dbUsersId = new Set();

		dbUsers.forEach((user) => {
			dbUsersId.add(user.id);
		});

		// TODO Clean this up (goes into the discord database and pulls users from all servers. then loads it into DB)
		client.guilds.fetch()
			.then((guilds) => {
				guilds.forEach((guild) => {
					guild.fetch()
						.then((trueGuild) => {
							if (trueGuild.available) {
								trueGuild.members.fetch()
									.then((members) => {
										members.forEach((member) => {
											if (dbUsersId.has(BigInt(member.id))) return;
											if (member.user) {
												DekDB.addUser(member.user);
											}
											else {
												DekDB.addUser({ id: member.id, username: 'N/A' });
											}
										});
									});
							}
						});
				});
			});

	},
};