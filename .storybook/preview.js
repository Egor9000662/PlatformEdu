import '../app/styles/index.scss';

import { BrowserRouter as Router, Route } from 'react-router-dom';

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
}

export const decorators = [
	(Story) => (
		<Router>
			<Story />
		</Router>
	),
];
