const { DekDB } = require('./dekDB');

function directoryParser(resourceObject) {

	const check = true;
	// checks to see if name is valid and not empty
	if (resourceObject.name === undefined ||
		resourceObject.name === '') throw new Error('Name is empty.');

	//  Checks to see if DB already contains directory from the same guild
	if (DekDB.checkDB(['SELECT * FROM directory WHERE guild_id = ? AND name = ?'], [[resourceObject.guildId, resourceObject.name]])) throw new Error('Name is already taken.');
	// if description is empty throw an error
	if (resourceObject.description === undefined ||
		resourceObject.description === '') throw new Error('Description is empty.');
	return check;

}

module.exports = directoryParser;