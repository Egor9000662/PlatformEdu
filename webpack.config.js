const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const dartSASS = require("sass");

const dirname = process.cwd();
const favicon = path.join(dirname, "./app/common/assets/favicon.png");
module.exports = () => {
	const publicPath = "/";
	const jsEntry = path.join(dirname, `./app/index.jsx`);
	const htmlEntry = path.join(dirname, `./app/index.html`);

	return {
		entry: jsEntry,
		output: {
			path: path.resolve(dirname,'/dist'),
			publicPath,
			filename: "index.js",
			clean: true,
		},

		devtool: "eval-source-map",

		devServer: {
			port: 80,
			hot: true,
			liveReload: true,
			open: false,
			historyApiFallback: {
				verbose: true,
			},
		},

		optimization: {
			minimizer: ["...", new CssMinimizerPlugin()],
		},

		plugins: [
			new MiniCssExtractPlugin({
				filename: "index.css",
			}),
			new HtmlWebpackPlugin({
				template: htmlEntry,
				favicon,
			}),
		],

		module: {
			rules: [
				{
					test: /\.(js|jsx|cjs)$/,
					exclude: /node_modules/,
					use: ["babel-loader"],
				},
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, "css-loader"],
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: {
								sourceMap: true,
							},
						},
						{
							loader: "sass-loader",
							options: {
								implementation: dartSASS,
								sourceMap: true,
								sassOptions: {
									outputStyle: "expanded",
								},
							},
						},
					],
				},
				{
					test: /\.(jpg|png)$/,
					use: {
						loader: "url-loader",
					},
				},
				{
					test: /\.svg$/,
					use: ["@svgr/webpack", "file-loader"],
				},
			],
		},

		resolve: {
			extensions: ["*", ".js", ".jsx"],
		},
	};
};
