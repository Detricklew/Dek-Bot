const { DekDB } = require('./dekDB');

function parser(resourceObject) {

	const directory = DekDB.getDirectory(resourceObject.directory, resourceObject.guildId);
	const check = true;
	// checks to see if directory is in database
	if (!directory) throw new Error('Directory does not exist');
	// checks to see if description is valid and not empty
	if (resourceObject.description === undefined ||
		resourceObject.description === '') throw new Error('Description is empty.');
	// makes sure url is a valid one
	try {
		new URL(resourceObject.url);
	}
	catch (e) {
		throw new Error('Resource Link is not valid');
	}

	// if there are any roles submitted
	if (resourceObject.categories) {
		if(directory.categories) throw new Error('Categories are invalid/does not exist in this directory');
		const categories = directory.categories.split(',');
		directory.categories = directory.categories.split(',');
		resourceObject.categories.forEach((category) => {
			// if roles isn't in database fail test
			if (categories.indexOf(category) == -1) throw new Error('Categories are invalid/does not exist in this directory');
		});
	}


	// If user inputs wrong data it will fail initialization and throw an error
	if (resourceObject.dateRemoved && (Date.parse(resourceObject.dateRemoved) === 0 ||
		isNaN(Date.parse(resourceObject.dateRemoved)))) throw new Error('Invalid date');

	return check;

}

module.exports = parser;