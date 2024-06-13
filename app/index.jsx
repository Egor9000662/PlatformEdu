import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import ReactDOM from 'react-dom';
import {ApolloProvider} from "@apollo/client";
import client from "./common/apollo/client";
import './styles/index.scss';

import App from './App';

import store from './common/store/store';

const node = document.querySelector('#root');

ReactDOM.render(
	<BrowserRouter>
		<Provider {...store}>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</Provider>
	</BrowserRouter>,
	node,
);
