const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				primary: {
					50: '#fff1f5',
					100: '#ffe4eb',
					200: '#fecddb',
					300: '#fda4bd',
					400: '#fb7197',
					500: '#f43f71',
					600: '#e11d53',
					700: '#be1242',
					800: '#9f1239',
					900: '#881333',
					950: '#4c0519'
				},
				'donkey-brown': {
					50: '#f5f4f1',
					100: '#e6e3db',
					200: '#cec8ba',
					300: '#b2a692',
					400: '#9e8d76',
					500: '#8d7a65',
					600: '#796555',
					700: '#625046',
					800: '#54453f',
					900: '#4a3d39',
					950: '#29211f'
				},
				cloudy: {
					50: '#f8f8f8',
					100: '#f1f0ef',
					200: '#e6e4e2',
					300: '#d4d0cd',
					400: '#b1aaa5',
					500: '#a09893',
					600: '#88807a',
					700: '#716964',
					800: '#5f5955',
					900: '#524d4a',
					950: '#2a2725'
				},
				marshland: {
					50: '#f8f8f5',
					100: '#e8eadd',
					200: '#d0d4bb',
					300: '#afb791',
					400: '#8c976a',
					500: '#707c50',
					600: '#59633e',
					700: '#4a5134',
					800: '#3c422d',
					900: '#353928',
					950: '#0e100a'
				},
				graphite: {
					50: '#f9f8ed',
					100: '#f1f0d0',
					200: '#e5dfa3',
					300: '#d6c96e',
					400: '#c9b246',
					500: '#ba9d38',
					600: '#a07e2e',
					700: '#805e28',
					800: '#6c4e27',
					900: '#5d4126',
					950: '#25180d'
				}
			}
		}
	}
};

module.exports = config;
