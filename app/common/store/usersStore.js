// import { makeAutoObservable, runInAction } from 'mobx';
// import { database } from '../../modules/firebase';
// import UserStore from './userStore';
//
// export default class UsersStore {
// 	users = [];
//
// 	isLoaded = false;
//
// 	dataDone = false;
//
// 	tasksUnchecked = [];
//
// 	studentsUnchecked = [];
//
// 	overdue = false;
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
// 		const ref = database.ref(db, 'users');
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		const users = Object.entries(res)
// 			.filter((user) => user[1].uid !== undefined)
// 			.map(([key, value]) =>
// 				UserStore.createUser(
// 					{
// 						...value,
// 						id: key,
// 					},
// 					{ isLoaded: true }
// 				)
// 			);
// 		Object.entries(res)
// 			.filter((user) => user[1].uid === undefined)
// 			.forEach((user) => this.deleteEmptyUser(user[0]));
// 		runInAction(() => {
// 			this.users = users;
// 			this.isLoaded = true;
// 		});
// 	};
//
// 	deleteEmptyUser = async (id) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${id}`);
// 		await database.remove(ref);
// 	};
//
// 	setLoaded = (value) => {
// 		this.isLoaded = value;
// 	};
//
// 	getUser = (id) => {
// 		let user = null;
//
// 		user = this.users.find((item) => item.uid === id);
// 		if (!user) {
// 			user = UserStore.createUser({ uid: id }, { isLoaded: false });
// 			this.users.push(user);
// 		}
// 		return user;
// 	};
//
// 	isAnonymous = (id) => {
// 		return this.users.some((item) => item.uid === id && item.isAnonymous === true);
// 	}
//
// 	getStudentStatus = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/status`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		if (!res) {
// 			return;
// 		}
// 		return res;
// 	};
//
// 	findOverdue = async (uid) => {
// 		this.clearTasksUnchecked();
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${uid}/practice`);
// 		const tasksData = await database.get(ref);
// 		const res = tasksData.toJSON();
// 		if (!res) {
// 			return;
// 		}
// 		const currentDate = Date.now();
//
// 		const tasksInfo = Object.entries(res).map(([key, value]) => ({
// 			taskId: key,
// 			...value,
// 		}));
// 		const overdue = tasksInfo.find(
// 			(task) => task.needToCheckAt <= currentDate
// 		);
// 		if (overdue !== undefined) {
// 			this.checkLongOverdue(uid, overdue);
// 			return true;
// 		}
// 		return false;
// 	};
//
// 	checkLongOverdue = async (uid, overdue) => {
// 		const currentDate = Date.now();
// 		if (overdue) {
// 			const daysOverdue = Math.floor(
// 				(currentDate - overdue.needToCheckAt) / 1000 / 60 / 60 / 24
// 			);
// 			if (daysOverdue >= 7) this.openUncheckedStudent(uid);
// 			/**1664654400000*/
// 		} else {
// 			this.findOverdue(uid);
// 		}
// 	};
// 	openUncheckedStudent = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		await database.update(ref, { isUnchecked: true });
// 	};
//
// 	closeUncheckedStudent = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/isUnchecked`);
// 		await database.remove(ref);
// 	};
//
// 	addPersonalMentor = async (uid, mentorInfo) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		await database.update(ref, { personalMentor: mentorInfo });
// 	};
//
// 	getUncheckedStudents = async () => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, 'users');
// 		const data = await database.get(ref);
// 		const res = Object.values(data?.toJSON());
// 		const uncheckedUsers = res?.filter((student) => student.isUnchecked);
// 		return uncheckedUsers;
// 	};
//
// 	getSentTasksInfo = async (uid, name, group, course, isOverdue) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${uid}/practice`);
// 		const tasksData = await database.get(ref);
// 		const res = tasksData.toJSON();
// 		if (!res) {
// 			return;
// 		}
// 		const tasksInfo = Object.entries(res).map(([key, value]) => ({
// 			taskId: key,
// 			...value,
// 		}));
//
// 		const userInfo = { uid, name, group, course };
// 		runInAction(() => {
// 			this.studentsUnchecked.push(userInfo);
// 		});
// 		this.updateUnseen(tasksInfo, userInfo);
// 		if (isOverdue) {
// 			this.getTasksOverdue(tasksInfo, userInfo);
// 		}
// 	};
//
// 	getTasksOverdue = (tasksInfo, userInfo) => { // todo берет прогресс, при множественных группах будет несколько прогрессов
// 		const currentDate = Date.now();
// 		const tr = [];
// 		for (let task of tasksInfo) {
// 			const checkDeadline = task.needToCheckAt;
// 			const taskMark = task.isCrystal;
// 			if (currentDate > checkDeadline && !taskMark) {
// 				tr.push({
// 					student: userInfo.name,
// 					group: userInfo.group,
// 					taskId: task.taskId,
// 					title: task.taskName,
// 					lesson: task.lesson,
// 					uid: userInfo.uid,
// 					course: userInfo.course,
// 				});
// 			}
// 		}
// 		runInAction(() => {
// 			this.tasksUnchecked.push(tr);
// 		});
// 	};
//
// 	updateUnseen = async (tasksInfo, userInfo) => {
// 		const currentDate = Date.now();
// 		for (let task of tasksInfo) {
// 			const taskMark = task.isCrystal;
// 			const taskNoChecked = task.isUnseen;
// 			const taskCheckDate = task.viewingDate + 1000 * 60 * 60 * 24;
// 			if (currentDate > taskCheckDate && !taskMark && !taskNoChecked) {
// 				const db = database.getDatabase();
// 				const ref = database.ref(
// 					db,
// 					`progress/${userInfo.uid}/practice/${task.taskId}`
// 				);
// 				await database.update(ref, {
// 					isUnseen: true,
// 					unseenMessages: 1,
// 				});
// 				const userRef = database.ref(
// 					db,
// 					`users/${userInfo.uid}/unseenChats/lesson-${task.lesson}/${task.taskId}`
// 				);
// 				await database.update(userRef, { isUnseen: true });
// 			}
// 		}
// 	};
//
// 	clearTasksUnchecked = async () => {
// 		this.tasksUnchecked = [];
// 	};
//
// 	getFilteredUsers = (username) => {
// 		const res = this.users.filter((user) => {
// 			if (user.name.toLowerCase().includes(username.toLowerCase())) {
// 				return user;
// 			}
// 			return null;
// 		});
//
// 		return res;
// 	}
//
// 	getAnonymousUser = () => {
// 		return this.users.find((user) =>
// 			user.isAnonymous
// 		);
// 	}
// }
