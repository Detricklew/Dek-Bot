const Database = require('better-sqlite3');

// eslint-disable-next-line no-undef
const { DBname } = require('../../config.json');

const DekDB = (function() {

	const createDB = () => {
		// Initializes DB for future use
		const db = new Database(DBname);
		db.exec(`CREATE TABLE IF NOT EXISTS "user" (
			"id"	INTEGER NOT NULL UNIQUE,
			"Username"	TEXT NOT NULL,
			PRIMARY KEY("id")
		  )`);
		db.exec(`CREATE TABLE IF NOT EXISTS "reaction" (
			"user_id"	INTEGER NOT NULL,
			"messages_id"	INTEGER NOT NULL,
			"reaction"	TEXT NOT NULL,
			FOREIGN KEY("messages_id") REFERENCES "message"("id"),
			FOREIGN KEY("user_id") REFERENCES "user"("id")
		  )`);
		db.exec(`CREATE TABLE IF NOT EXISTS "message" (
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
		db.exec(`CREATE TABLE IF NOT EXISTS "guilds" (
			"id"	INTEGER NOT NULL,
			"name"	TEXT NOT NULL,
			PRIMARY KEY("id")
		  )`);
		db.exec(`CREATE TABLE IF NOT EXISTS "channels" (
			"id"	INTEGER NOT NULL,
			"guild_id"	INTEGER NOT NULL,
			"name"	TEXT NOT NULL,
			"type"  INTEGER NOT NULL,
			PRIMARY KEY("id"),
			FOREIGN KEY("guild_id") REFERENCES "guilds"("id")
		  )`);
		db.exec(`CREATE TABLE IF NOT EXISTS "resources" (
			"id" INTEGER NOT NULL,
			"guild_id" INTEGER NOT NULL,
			"directory_id" INTEGER NOT NULL,
			"user_id" INTEGER NOT NULL,
			"description" TEXT NOT NULL,
			"url" TEXT NOT NULL,
			"roles" TEXT,
			"date_to_be_removed" INTEGER,
			PRIMARY KEY("id"),
			FOREIGN KEY("guild_id") REFERENCES "guilds"("id"),
			FOREIGN KEY("directory_id") REFERENCES "directory"("id"),
			FOREIGN KEY("user_id") REFERENCES "user_id" 
		)`);
		db.exec(`CREATE TABLE IF NOT EXISTS "directory" (
			"id" INTEGER NOT NULL,
			"guild_id" INTEGER NOT NULL,
			"name" TEXT NOT NULL UNIQUE,
			"roles" TEXT NOT NULL,
			"channel_id" INTEGER,
			"channel_exclusive" INTEGER NOT NULL,
			PRIMARY KEY("id")
			FOREIGN KEY ("guild_id") REFERENCES "guilds"("id"),
			FOREIGN KEY ("channel_id") REFERENCES "channels"("id")
		)`);
		// for faster performance
		db.pragma('journal_mode = WAL');
	};

	const getDirectory = (directoryName) => {
		// Creates new Database
		const db = new Database(DBname);

		const statement = db.prepare('SELECT * FROM directory WHERE name LIKE ?');
		// takes the user input and searches for similar db
		return statement.run(`%${directoryName}%`);
	};
	return { getDirectory, createDB };
})();

module.exports.DekDB = DekDB;