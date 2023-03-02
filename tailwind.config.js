/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,jsx,tx,tsx}',
		'./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
		'./node_modules/react-tailwindcss-select/dist/index.esm.js',
	],
	theme: {
		extend: {},
	},
	plugins: [require('flowbite/plugin')],
};
