const { DekDB } = require('./dekDB');

function parser(resourceObject) {

	const directory = DekDB.getDirectory(resourceObject.directory);
	const check = true;
	// checks to see if directory is in files
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
	if (resourceObject.roles) {

		const roles = directory.roles.split(' ');
		resourceObject.roles.forEach((role) => {
			// if roles isn't in database fail test
			if (roles.indexOf(role) == -1) throw new Error('Roles are invalid/does not exist in this directory');
		});
	}


	// If user inputs wrong data fails initialization
	if (resourceObject.dateRemoved && (Date.parse(resourceObject.dateRemoved) === 0 ||
		isNaN(Date.parse(resourceObject.dateRemoved)))) throw new Error('Invalid date');

	return check;

}

module.exports = parser;