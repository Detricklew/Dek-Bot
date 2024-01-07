const Database = require('better-sqlite3');
const { DBname } = require('../../config.json');

class DekDB {
	#db = new Database(DBname);

	createDB() {
		// Initializes DB for future use
		
		this.#db.exec(`CREATE TABLE IF NOT EXISTS "user" (
			"id"	INTEGER NOT NULL UNIQUE,
			"Username"	TEXT NOT NULL,
			PRIMARY KEY("id")
		  )`);
		this.#db.exec(`CREATE TABLE IF NOT EXISTS "reaction" (
			"user_id"	INTEGER NOT NULL,
			"messages_id"	INTEGER NOT NULL,
			"reaction"	TEXT NOT NULL,
			FOREIGN KEY("messages_id") REFERENCES "message"("id"),
			FOREIGN KEY("user_id") REFERENCES "user"("id")
		  )`);
		this.#db.exec(`CREATE TABLE IF NOT EXISTS "message" (
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
		this.#db.exec(`CREATE TABLE IF NOT EXISTS "guilds" (
			"id"	INTEGER NOT NULL,
			"name"	TEXT NOT NULL,
			PRIMARY KEY("id")
		  )`);
		this.#db.exec(`CREATE TABLE IF NOT EXISTS "channels" (
			"id"	INTEGER NOT NULL,
			"guild_id"	INTEGER NOT NULL,
			"name"	TEXT NOT NULL,
			"type"  INTEGER NOT NULL,
			PRIMARY KEY("id"),
			FOREIGN KEY("guild_id") REFERENCES "guilds"("id")
		  )`);
		this.#db.exec(`CREATE TABLE IF NOT EXISTS "resources" (
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
			FOREIGN KEY("user_id") REFERENCES "user"("id") 
		)`);
		this.#db.exec(`CREATE TABLE IF NOT EXISTS "directory" (
			"id" INTEGER NOT NULL,
			"guild_id" INTEGER NOT NULL,
			"name" TEXT NOT NULL,
			"description" TEXT NOT NULL,
			"roles" TEXT,
			PRIMARY KEY("id")
			FOREIGN KEY ("guild_id") REFERENCES "guilds"("id")
		)`);
		// for faster performance
		this.#db.pragma('journal_mode = WAL');
	}
	// returns a single object representing an directory if true undefined if not
	getDirectory(directoryName) {
		const statement = this.#db.prepare('SELECT * FROM directory WHERE name = ?');
		// takes the user input and searches for similar db
		return statement.get(directoryName);
	}


	// takes an array and checks if the database has it
	checkDB(statements, parameters) {
		// starts the check as false
		let check = false;
		
		for (let statement in statements) {
			const stmt = this.#db.prepare(statements[statement]);
			if(stmt.get(parameters[statement])) {
				// if data is returned break loop and return true 
				check = true;
				break;
			}
		}

		return check;
	}
	// adds a directory to the database 
	addDirectory(directoryObject) {
		const stmt = this.#db.prepare(`INSERT INTO directory (name, guild_id, description) VALUES (:name, :guildId, :description )`);
		try{
			stmt.run(directoryObject);
		}
		catch (e) {
			console.error(e);
			throw new Error('Something went wrong 🫠');
		}
	}
	// adds a guild to the DB
	addGuild(guild) {
		const stmt = this.#db.prepare(`INSERT INTO guilds (id, name) VALUES (?, ?)`);
		try{
			stmt.run(guild.id, guild.name);
		}
		catch (e) {
			console.error(e);
		}
	}

	// returns an array of all guilds if successful, an empty one if not 
	getGuilds() {
		
		const stmt = this.#db.prepare(`SELECT * FROM guilds`);
		stmt.safeIntegers();
		
		try{
			const guilds = stmt.all();
			return guilds;
		}
		catch(e) {
			console.error(e);
			return [];
		}
	}

	// returns an array of all users if successful, an empty one if not
	getUsers() {
		const stmt = this.#db.prepare(`SELECT * FROM user`);
		stmt.safeIntegers();

		try{
			const users = stmt.all();
			return users;
		}
		catch(e) {
			console.error(e);
			return [];
		}
	}
	// Adds a user to the database
	addUser(user) {
		const stmt = this.#db.prepare('INSERT INTO user (id, username) VALUES (?, ?)');

		try{
			stmt.run(user.id, user.username);
		}
		catch (e) {
			console.error(e);
		}
	}
	// Adds a resource to the DB
	addResource(resource) {
		const stmt = this.#db.prepare(`INSERT INTO resources (guild_id, directory_id, user_id, description, url, roles, date_to_be_removed) VALUES (?,?,?,?,?,?,?)`);

		try{
			stmt.run(resource.guildId, resource.directoryId, resource.userId, resource.description, resource.url, resource.roles, resource.dateRemoved);
		}
		catch (e) {
			console.error(e);
		}
	}
}

module.exports.DekDB = new DekDB();