module.exports = {
	"stories": [
		"../app/**/*.stories.mdx",
		"../app/**/*.stories.@(js|jsx|ts|tsx)"
	],
	"addons": [
		"@storybook/addon-links",
		"@storybook/addon-essentials"
	],
	"core": {
		"builder": "webpack5"
	},
	webpackFinal: (config) => {
		config.module.rules.push({
			test: /\.scss$/,
			use: [
				'style-loader',
				'css-loader',
				{
					loader: require.resolve('sass-loader'),
					options: {
						implementation: require('sass'),
					},
				}
			],
		});

		// config.plugins.push(...);
		return config;
	},
}
