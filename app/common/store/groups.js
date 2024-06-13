// /* eslint-disable */
// import { makeAutoObservable, runInAction } from "mobx";
// import { database } from "../../modules/firebase";
// import GroupStore from "./group";
//
// export default class GroupsStore {
// 	groups = [];
//
// 	isLoaded = false;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	loadData = async () => {
// 		if (this.isLoaded) {
// 			return;
// 		}
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, "groups");
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		const groups = Object.entries(res).map(([key, value]) =>
// 			GroupStore.createGroup(
// 				{
// 					...value,
// 					id: key,
// 				},
// 				{ isLoaded: true }
// 			)
// 		);
//
// 		this.setGroups(groups);
// 		this.setLoaded(true);
// 	};
//
// 	getGroup = (id) => {
// 		let group = null;
//
// 		group = this.groups.find((item) => item.id === id);
// 		if (!group) {
// 			group = GroupStore.createGroup({ id }, { isLoaded: false });
// 			runInAction(() => {
// 				this.groups.push(group);
// 			});
// 		}
//
// 		return group;
// 	};
//
// 	setGroups(groups) {
// 		this.groups = groups;
// 	}
//
// 	setLoaded = (value) => {
// 		this.isLoaded = value;
// 	};
//
// 	removeGroup = async (groupId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}`);
// 		await database.remove(ref);
// 	};
// }
//
// // метод на изменение группы, 3 запроса
