const sqlite3 = require('sqlite3').verbose();
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	execute() {
		// Runs the DB and sets up parameters
		const db = new sqlite3.Database('./sample-database.db', (err) => {
			if (err) {
				return console.error(err);
			}
			else {
				db.run(`CREATE TABLE IF NOT EXISTS "user" (
                          "id"	INTEGER NOT NULL UNIQUE,
                          "Username"	TEXT NOT NULL,
                          PRIMARY KEY("id")
                        )`);
				db.run(`CREATE TABLE IF NOT EXISTS "reaction" (
                          "user_id"	INTEGER NOT NULL,
                          "messages_id"	INTEGER NOT NULL,
                          "reaction"	TEXT NOT NULL,
                          FOREIGN KEY("messages_id") REFERENCES "message"("id"),
                          FOREIGN KEY("user_id") REFERENCES "user"("id")
                        )`);
				db.run(`CREATE TABLE IF NOT EXISTS "message" (
                            "user_id"	INTEGER NOT NULL,
                            "content"	TEXT,
                            "guild_id"	INTEGER NOT NULL,
                            "channel_id"	INTEGER NOT NULL,
                            "timestamp"	INTEGER NOT NULL,
                            "id"	INTEGER NOT NULL,
                            FOREIGN KEY("channel_id") REFERENCES "channels"("id"),
                            PRIMARY KEY("id"),
                            FOREIGN KEY("guild_id") REFERENCES "guilds"("id"),
                            FOREIGN KEY("user_id") REFERENCES "user"("id")
                          )`);
				db.run(`CREATE TABLE IF NOT EXISTS "guilds" (
                            "id"	INTEGER NOT NULL,
                            "name"	TEXT NOT NULL,
                            PRIMARY KEY("id")
                          )`);
				db.run(`CREATE TABLE IF NOT EXISTS "custom_responses" (
                            "id"	INTEGER NOT NULL,
                            "name" TEXT NOT NULL,
                            "user_id"	INTEGER NOT NULL,
                            "trigger"	TEXT NOT NULL,
                            "response"	TEXT NOT NULL,
                            "guild_id"	INTEGER NOT NULL,
                            "channel_exclusive"	INTEGER NOT NULL,
                            "channel_id"	INTEGER,
                            "primary_response" INTEGER NOT NULL,
                            PRIMARY KEY("id" AUTOINCREMENT),
                            FOREIGN KEY("channel_id") REFERENCES "channels"("id"),
                            FOREIGN KEY("user_id") REFERENCES "user"("id"),
                            FOREIGN KEY("guild_id") REFERENCES "guilds"("id")
                          )`);
				db.run(`CREATE TABLE IF NOT EXISTS "channels" (
                            "id"	INTEGER NOT NULL,
                            "guild_id"	INTEGER NOT NULL,
                            "name"	TEXT NOT NULL,
                            "type"  INTEGER NOT NULL,
                            PRIMARY KEY("id"),
							FOREIGN KEY("guild_id") REFERENCES "guilds"("id")
                          )`);
				console.log('Successfully loaded database "Dek-bot"');
				return;
			}
		});
	},
};