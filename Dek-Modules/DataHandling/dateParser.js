// Parsing date into YYYYMMDD
function dateParser(date) {
	const parseDate = new Date(date);

	const year = parseDate.getFullYear();
	const month = parseDate.getMonth() + 1;
	const day = parseDate.getDate();

	// '' converts everything to string
	return '' + year + (month < 10 ? '0' : '') + month + (day < 10 ? '0' : '') + day;
}

module.exports = dateParser;