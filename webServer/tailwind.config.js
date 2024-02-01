/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./dist/*.{html,js,ejs}',
		'./views/pages/*.{html,js,ejs}',
		'./views/partials/*.{html,js,ejs}',
	],
	theme: {
		extend: {},
	},
	plugins: ['prettier-plugin-tailwindcss'],
};

