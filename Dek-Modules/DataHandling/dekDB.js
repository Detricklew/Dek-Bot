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
			"name" TEXT NOT NULL,
			"description" TEXT NOT NULL,
			"url" TEXT NOT NULL,
			"categories" TEXT,
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
			"categories" TEXT,
			PRIMARY KEY("id")
			FOREIGN KEY ("guild_id") REFERENCES "guilds"("id")
		)`);
		// for faster performance
		this.#db.pragma('journal_mode = WAL');
	}
	// returns a single object representing an directory if true undefined if not
	getDirectory(directoryName, guild_id) {
		const statement = this.#db.prepare('SELECT * FROM directory WHERE name = ? AND guild_id = ?');
		// takes the user input and searches for similar db
		return statement.get(directoryName, guild_id);
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
	// removes guild from directory
	removeGuild(guild) {
		const stmt = this.#db.prepare(`DELETE FROM guilds WHERE id = ?`);
		
		try{
			stmt.run(guild.id);
		}
		catch (e) {
			console.error(e);
		}
	}
	// Attempts to remove resource
	removeResource(id, user_id, guild_id) {
		const stmt = this.#db.prepare(`DELETE FROM resources WHERE id = ? AND user_id = ? and guild_id = ?`);

		stmt.run(id,user_id,guild_id);
		return;
	}
	// Gets directory by guild id
	getDirectoryByGuild(guild_id) {
		const stmt = this.#db.prepare('SELECT * FROM directory WHERE guild_id = ?');

		return stmt.all(guild_id);
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
		const stmt = this.#db.prepare(`INSERT INTO resources (guild_id, directory_id, user_id, name, description, url, categories, date_to_be_removed) VALUES (?,?,?,?,?,?,?,?)`);

		try{
			stmt.run(resource.guildId, resource.directoryId, resource.userId, resource.name, resource.description, resource.url, resource.categories, resource.dateRemoved);
		}
		catch (e) {
			console.error(e);
		}
	}
	// Gets resource by guild user and id
	getResourceById(guild, user, id) {
		const stmt = this.#db.prepare(`SELECT * FROM resources WHERE guild_id = ? AND user_id = ? AND id = ?`);

		try{
			return stmt.get(guild.id, user.id, id);
		}
		catch (e) {
			console.error(e);
		}

	}
	// Gets a list of resources by user id
	getResourcesByUser(guild, user) {
		const stmt = this.#db.prepare(`SELECT * FROM resources WHERE guild_id = ? AND user_id = ?`);

		try{
			return stmt.all(guild.id, user.id);
		}
		catch (e) {
			console.error(e);
		}
	}
	// Gets resources by id
	getDirectoryById(id, guild_id) {
		const stmt = this.#db.prepare(`SELECT * FROM directory WHERE id = ? AND guild_id = ?`);

		try {
			return stmt.get(id, guild_id)
		}
		catch(e){
			console.error(e);
		}
	}
	// Updates resources
	updateResources(resource) {
		const stmt = this.#db.prepare(`UPDATE resources SET name = ?, description = ?, url = ?, categories = ?, date_to_be_removed = ? WHERE id = ?  and user_id = ?`);

		try{
			stmt.run(resource.name, resource.description, resource.url, resource.categories, resource.dateRemoved, resource.id, resource.userId);
		}
		catch(e) {
			console.error(e)
		}
	}
	// removes directory
	removeDirectory(directory_id, guild_id) {
		const stmt = this.#db.prepare('DELETE FROM resources WHERE directory_id = ? AND guild_id = ?');
		const stmt2 = this.#db.prepare("DELETE FROM directory WHERE id = ? AND guild_id = ?");

		stmt.run(directory_id,guild_id);
		stmt2.run(directory_id,guild_id);
		return;
		
	}


}

module.exports.DekDB = new DekDB();