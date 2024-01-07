/* eslint-disable no-undef */
// Directory.test.js
const directoryParser = require('../Dek-Modules/DataHandling/directoryParser');
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');
jest.mock('../Dek-Modules/DataHandling/dekDB');

describe('Directory', () => {
	test('should throw an error if name is empty', () => {
		expect(() => directoryParser({ name: '', description: 'a description' })).toThrow('Name is empty.');
	});

	test('should throw an error if name is already taken', () => {
		DekDB.checkDB.mockReturnValue(true);

		expect(() => directoryParser({ name: 'takenName', description: 'some description' })).toThrow('Name is already taken.');
	});

	test('should throw an error if description is empty', () => {
		DekDB.checkDB.mockReturnValue(false);
		expect(() => directoryParser({ name: 'validName', description: '' })).toThrow('Description is empty.');
	});

	test('should create a directory with valid name and description', () => {
		expect(directoryParser({ name: 'validName', description: 'valid description' })).toBe(true);
	});
});
