// import { makeAutoObservable } from 'mobx';
// import { Provider } from 'mobx-react';
// import React from 'react';
//
// export default class AuthStoreMock {
// 	isLoading = true;
//
// 	user = null;
//
// 	constructor({ user, isLoading }) {
// 		makeAutoObservable(this);
// 		this.user = user;
// 		this.isLoading = isLoading;
// 	}
//
// 	signup = async (params) => {
// 		this.setUser(params);
// 	}
//
// 	login = (email) => {
// 		this.user = {
// 			email,
// 			uid: '123',
// 			displayName: 'Пользователь',
// 		};
// 	}
//
// 	logout = () => {
// 		this.user = null;
// 	}
// }
//
// export const AuthLogin = ({ children }) => (
// 	<Provider
// 		auth={new AuthStoreMock({
// 			user: null,
// 			isLoading: false,
// 		})}
// 	>
// 		{children}
// 	</Provider>
// );
//
// export const AuthUser = ({ children }) => (
// 	<Provider
// 		auth={new AuthStoreMock({
// 			user: {
// 				displayName: 'Пользователь',
// 				uid: '234',
// 			},
// 			isLoading: false,
// 		})}
// 	>
// 		{children}
// 	</Provider>
// );
//
// export const AuthLoading = ({ children }) => (
// 	<Provider
// 		auth={new AuthStoreMock({
// 			isLoading: true,
// 		})}
// 	>
// 		{children}
// 	</Provider>
// );
