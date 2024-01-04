function directoryParser(resourceObject) {

	const check = true;

	// checks to see if description is valid and not empty
	if (resourceObject.name === undefined ||
		resourceObject.name === '') throw new Error('Name is empty');

	if (resourceObject.description === undefined ||
		resourceObject.description === '') throw new Error('description is empty');
	return check;

}

module.exports = directoryParser;