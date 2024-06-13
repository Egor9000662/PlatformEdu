// import { makeAutoObservable, runInAction } from 'mobx';
// import { database } from '../../modules/firebase';
// import { v4 } from "uuid";
//
// export default class ChatStore {
//     uid = null;
//     name = '';
//     messages = {};
//     users = [];
//     viewingDate = null;
//     isLoaded = false;
//     lastMessageDate = null;
//     isAnonymous = false;
//
//     constructor() {
//         makeAutoObservable(this);
//     }
//
//     static createChat(data, { isLoaded = false } = {}) {
//         const store = new ChatStore();
//         store.setData(data);
//         store.setLoaded(isLoaded);
//         store.updateMessages();
//         return store;
//     }
//
//     setData(data) {
//         this.uid = data.uid;
//         this.name = data.name || '';
//         this.messages = data.messages || {};
//         this.setUsers(data.users);
//         this.viewingDate = data.viewingDate || null;
//         this.lastMessageDate = data.lastMessageDate || null;
//         this.isAnonymous = data.isAnonymous || false;
//     }
//
//     get isLoaded() {
//         return this.isLoaded;
//     }
//
//     set isLoaded(isLoaded) {
//         return this.isLoaded = isLoaded;
//     }
//
//     setLoaded(value) {
//         this.isLoaded = value;
//     }
//
//     loadData = async (uid) => {
//         if (!uid) {
//             return;
//         }
//         this.uid = uid;
//
//         const db = database.getDatabase();
//         const ref = database.ref(
//             db,
//             `chats/${uid}`
//         );
//         const data = await database.get(ref);
//         const res = data.toJSON();
//
//         runInAction(() => {
//             this.setMessages(res.messages);
//             this.setUsers(res.users);
//             this.isLoaded = true;
//         });
//     };
//
//     // Users block
//
//     setUsers(users) {
//         if (!users) {
//             users = [];
//         }
//
//         this.users = Object.values(users);
//     }
//
//     // Message block
//
//     setMessages(messages) {
//         if (!messages) {
//             messages = {};
//         }
//
//         this.messages = Object.entries(messages)
//             .map(([key, value]) => ({
//                 messageId: key,
//                 ...value,
//             }));
//     }
//
//     sendMessage = async (message) => {
//         if (!message || (!message.text && !message.files)) {
//             return;
//         }
//         const currentDate = new Date(Date.now());
//         const timeSent = new Date(currentDate).setDate(currentDate.getDate());
//         const messageId = v4();
//         let messageObj = {
//             timeSent,
//             seen: false,
//             messageId,
//             ...message,
//         };
//
//         let updObject = {
//             lastMessageDate: timeSent,
//             [`messages/${messageObj.messageId}`]: messageObj,
//         };
//         if (this.isAnonymous && Object.values(this.messages).length === 0) {
//             updObject['isAnonymous'] = true;
//         }
//         if (Object.values(this.messages).length === 0) {
//             const usersObj = {};
//             this.users?.forEach((user, index) => {
//                 usersObj[index] = user;
//             });
//             updObject['users'] = usersObj;
//         }
//
//         const db = database.getDatabase();
//         const ref = database.ref(
//             db,
//             `chats/${this.uid}`
//         );
//         await database.update(ref, updObject);
//
//         runInAction(() => {
//             this.lastMessageDate = timeSent;
//         });
//     };
//
//     updateMessages = () => {
//         const db = database.getDatabase();
//         const ref = database.ref(db,
//             `chats/${this.uid}/messages`
//         );
//         database.onValue(ref, snapshot => {
//             let messages = [];
//             snapshot.forEach((snap) => {
//                 messages.push(snap.val());
//             });
//             this.setMessages(messages);
//         });
//     }
//
//     getMessageById = (messageId) => {
//         return Object.values(this.messages).find((message) => message.messageId === messageId);
//     }
//
//     getSortedMessages = () => {
//         return Object.values(this.messages).sort((a, b) => {
//             return b.timeSent - a.timeSent;
//         });
//     }
//
//     editMessage = async (messageId, text, link = null) => {
//         const message = this.getMessageById(messageId);
//         const db = database.getDatabase();
//         const ref = database.ref(
//             db,
//             `chats/${this.uid}/messages/${messageId}`
//         );
//
//         message.text = text;
//         message.link = link;
//         await database.update(ref, message);
//     }
//
//     deleteMessage = async (messageId) => {
//         const db = database.getDatabase();
//         const ref = database.ref(
//             db,
//             `chats/${this.uid}/messages/${messageId}`
//         );
//         await database.remove(ref);
//     }
//
//     // Unseen block
//
//     getUnseenMessagesCount = (currentUserUid) => {
//         return Object.values(this.messages).reduce((acc, message) =>
//             !message.seen && message.sender !== currentUserUid ? acc + 1 : acc, 0);
//     }
//
//     getTaskIds = () => {
//         if (this.isAnonymous) {
//             return Object.values(this.messages).map((message) => message.taskId);
//         }
//     }
//
//     setSeenMessages = async (currentUserUid) => {
//         const db = database.getDatabase();
//         const ref = database.ref(
//             db,
//             `chats/${this.uid}/messages`
//         );
//         const messages = await database.get(ref);
//         const res = messages.toJSON();
//         const messageObj = {};
//
//         if (!res) {
//             return;
//         }
//         Object.entries(res).map(([key, value]) => {
//             if (!value.seen && value.sender !== currentUserUid) {
//                 messageObj[key] = {
//                     ...value,
//                     seen: true,
//                     viewingDate: Date.now(),
//                 };
//             }
//         });
//
//         await database.update(ref, messageObj);
//     }
//
// }
