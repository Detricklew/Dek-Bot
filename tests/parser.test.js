/* eslint-disable no-undef */
const parser = require('../Dek-Modules/DataHandling/resourceParser');
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');
jest.mock('../Dek-Modules/DataHandling/dekDB');


test('validates object with all valid properties', () => {
	const validObject = {
		directory: 'dir1',
		description: 'A valid description',
		url: 'https://www.example.com',
		roles: 'role1,role2',
		dateRemoved: '01/01/2023',
	};

	DekDB.getDirectory.mockReturnValue({ name: 'dir1', roles: 'role1,role2' });

	expect(parser(validObject)).toBe(true);
});

test('fails validation for object with an invalid directory', () => {
	const invalidDirectoryObject = {
		directory: 'nonexistentDir',
		description: 'A valid description',
		url: 'https://www.example.com',
		roles: ['role1', 'role2'],
		dateRemoved: '01/01/2023',
	};
	DekDB.getDirectory.mockReturnValue(undefined);
	expect(() => parser(invalidDirectoryObject)).toThrow(new Error('Directory does not exist'));
});

test('fails validation for object with an empty description', () => {
	const emptyDescriptionObject = {
		directory: 'dir1',
		description: '',
		url: 'https://www.example.com',
		roles: ['role1', 'role2'],
		dateRemoved: '01/01/2023',
	};

	DekDB.getDirectory.mockReturnValue({ name: 'dir1', roles: 'role1 role2' });

	expect(() => parser(emptyDescriptionObject)).toThrow(new Error('Description is empty.'));
});

test('fails validation for object with an invalid URL', () => {
	const invalidUrlObject = {
		directory: 'dir1',
		description: 'A valid description',
		url: 'invalidUrl',
		roles: ['role1', 'role2'],
		dateRemoved: '01/01/2023',
	};

	DekDB.getDirectory.mockReturnValue({ name: 'dir1', roles: 'role1 role2' });

	expect(() => parser(invalidUrlObject)).toThrow(new Error('Resource Link is not valid'));
});

test('fails validation for object with invalid roles', () => {
	const invalidRolesObject = {
		directory: 'dir1',
		description: 'A valid description',
		url: 'https://www.example.com',
		categories: 'role1,123',
		dateRemoved: '01/01/2023',
	};

	DekDB.getDirectory.mockReturnValue({ name: 'dir1', categories: 'role1,role2' });

	expect(() => parser(invalidRolesObject)).toThrow(new Error('Categories are invalid/does not exist in this directory'));
});

test('validates object without dateRemoved property', () => {
	const objectWithoutDateRemoved = {
		directory: 'dir1',
		description: 'A valid description',
		url: 'https://www.example.com',
		roles: ['role1', 'role2'],
	};

	DekDB.getDirectory.mockReturnValue({ name: 'dir1', roles: 'role1 role2' });

	expect(parser(objectWithoutDateRemoved)).toBe(true);
});

test('fails validation for object with invalid dateRemoved format', () => {
	const invalidDateObject = {
		directory: 'dir1',
		description: 'A valid description',
		url: 'https://www.example.com',
		roles: ['role1', 'role2'],
		dateRemoved: '2023/01/01 8PM',
	};

	DekDB.getDirectory.mockReturnValue({ name: 'dir1', roles: 'role1 role2' });

	expect(() => parser(invalidDateObject)).toThrow(new Error('Invalid date'));
});