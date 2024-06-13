// import { makeAutoObservable } from "mobx";
// import { Provider } from "mobx-react";
// import React from "react";
//
// export default class GroupsStoreMock {
// 	groups = null;
//
// 	constructor({ groups }) {
// 		makeAutoObservable(this);
// 		this.groups = groups;
// 	}
//
// 	loadData = async () => {
// 		Promise.resolve();
// 	};
// }
//
// export const GroupsProvider = ({ children }) => (
// 	<Provider
// 		groupsStore={
// 			new GroupsStoreMock({
// 				// TODO: mock groups
// 				groups: [],
// 			})
// 		}
// 	>
// 		{children}
// 	</Provider>
// );
