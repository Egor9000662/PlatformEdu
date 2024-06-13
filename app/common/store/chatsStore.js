// import { makeAutoObservable, runInAction } from 'mobx';
// import { database } from '../../modules/firebase';
// import ChatStore from './chatStore';
//
// export default class ChatsStore {
// 	chats = [];
// 	isLoaded = false;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	get chats() {
// 		return this.chats;
// 	}
//
// 	setChats(chats) {
// 		if (!chats) {
// 			chats = [];
// 		}
// 		runInAction(() => {
// 			this.chats = chats
// 		});
// 	}
//
// 	setLoaded(value) {
// 		this.isLoaded = value;
// 	}
//
// 	loadData = async () => {
// 		if (this.isLoaded) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`chats`
// 		);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		if (!res) {
// 			return;
// 		}
// 		const chats = Object.entries(res).map(([key, value]) =>
// 			ChatStore.createChat({
// 				uid: key,
// 				...value,
// 			},
// 				{ isLoaded: true }
// 			)
// 		);
//
// 		runInAction(() => {
// 			this.setChats(chats);
// 			this.setLoaded(true);
// 		});
// 	}
//
// 	createChat = async (data) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`chats`
// 		);
// 		const chatKey = database.push(ref).key;
// 		const chat = ChatStore.createChat({ uid: chatKey, isNew: true, ...data }, { isLoaded: false });
// 		runInAction(() => {
// 			this.chats.push(chat);
// 		});
// 		return chat;
// 	}
//
// 	getChatByIds = async (ids) => {
// 		let chat = null;
// 		chat = this.chats.find((item) => {
// 			let res = true;
// 			ids.forEach((id) => {
// 				if (!Object.values(item.users)?.includes(id)) {
// 					res = false;
// 				}
// 			});
// 			return res;
// 		});
//
// 		if (!chat) {
// 			chat = await this.createChat({ users: ids });
// 		}
//
// 		return chat;
// 	};
//
// 	getAnonymousChatById = async (ids) => {
// 		let chat = null;
// 		chat = this.chats.find((item) => {
// 			let res = true;
// 			ids.forEach((id) => {
// 				if (!Object.values(item.users)?.includes(id)) {
// 					res = false;
// 				}
// 			});
// 			return res;
// 		});
//
// 		if (!chat) {
// 			chat = await this.createChat({ users: ids, isAnonymous: true });
// 		}
//
// 		return chat;
// 	}
// }
