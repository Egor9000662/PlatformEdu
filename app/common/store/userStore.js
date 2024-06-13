// import { makeAutoObservable, runInAction } from "mobx";
// import { database } from "../../modules/firebase";
// import CourseStore from "./courseStore";
//
// export default class UserStore {
// 	uid = null;
//
// 	status = "offline";
//
// 	email = null;
//
// 	course = null;
//
// 	courses = [];
//
// 	group = null;
//
// 	groups = [];
//
// 	name = null;
//
// 	nickname = null;
//
// 	nextWeek = {};
//
// 	progress = {};
//
// 	isLoaded = false;
//
// 	crystals = 0;
//
// 	debtor = false;
//
// 	monthsInDebt = 0;
//
// 	debtorDeleted = false;
//
// 	paymentDone = null;
//
// 	avatarURL = null;
//
// 	feedback = null;
//
// 	beneficiary = false;
//
// 	unseenWeeks = 0;
//
// 	personalMentor = null;
//
// 	blockedWeek = null;
//
// 	newUser = null;
//
// 	questionnaireInfo = null;
//
// 	achievement = null;
//
// 	unseenChats = null;
//
// 	isAnonymous = false;
//
// 	isUnchecked = undefined;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	/** Создание юзера с предзаполненными данными */
// 	static createUser(data, { isLoaded = false } = {}) {
// 		const store = new UserStore();
//
// 		store.setData(data);
// 		store.setLoaded(isLoaded);
// 		return store;
// 	}
//
// 	/** Загрузка данных cтудента */
// 	loadData = async () => {
// 		if (this.isLoaded || !this.uid) {
// 			return;
// 		}
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(db, `users/${this.uid}`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		res.uid = this.uid;
// 		if (!res.achievement) {
// 			res.achievement = await this.addStudentAchievement(res.uid, res.course);
// 		}
// 		this.setData(res);
// 		this.setLoaded(true);
// 	};
//
// 	getCrystals = async () => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${this.uid}/crystals`);
// 		const crystalData = await database.get(ref);
// 		const res = crystalData.toJSON();
// 		runInAction(() => {
// 			this.crystals = res || 0;
// 		});
// 	};
//
// 	getNotifs = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/notifs`);
// 		const notifsData = await database.get(ref);
// 		const res = notifsData.toJSON() || [];
//
// 		const keys = Object.keys(res);
// 		const notifs = Object.values(res);
// 		for (let index = 0; index < keys.length; index++) {
// 			notifs[index]["nid"] = keys[index];
// 		}
// 		return notifs;
// 	};
//
// 	setNotifSeen = async (uid, nid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/notifs/${nid}`);
// 		await database.update(ref, { seen: true });
// 	};
//
// 	setNotifSecondary = async (uid, nid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/notifs/${nid}`);
// 		await database.update(ref, { urgency: 3, seen: true });
// 	};
//
// 	setDebtorStatus = async (uid, groupId, startDate) => {
// 		if (groupId === "group-unassigned" || !uid) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		const studentInfo = await database.get(ref);
// 		const studentRes = studentInfo.toJSON();
// 		const paidRes = studentRes?.paymentDone;
// 		let datePaymentDone = new Date(paidRes);
//
// 		if (!paidRes) {
// 			this.setFirstPaymentDate(uid, startDate);
// 		}
//
// 		const groupPaymentDate = await this.getGroupPaymentDate(groupId);
// 		const currentMonthsInDebt = await this.getMonthsInDebt(uid);
// 		if (datePaymentDone < groupPaymentDate && currentMonthsInDebt > 0) {
// 			await database.update(ref, {
// 				debtor: true,
// 			});
// 		}
// 	};
//
// 	setFirstPaymentDate = async (uid, groupStart) => {
// 		if (!uid) {
// 			return
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		const firstPaymentInfo = new Date(groupStart);
// 		const firstPayment = firstPaymentInfo.getTime();
//
// 		await database.update(ref, { paymentDone: firstPayment });
// 	};
//
// 	getMonthsInDebt = async (uid) => {
// 		const db = database.getDatabase();
// 		const monthsRef = database.ref(db, `users/${uid}/monthsInDebt`);
// 		const monthsData = await database.get(monthsRef);
// 		const res = monthsData.toJSON();
// 		return res;
// 	};
//
// 	addMonthInDebt = async (uid, groupId) => {
// 		if (groupId === "group-unassigned") {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		const groupPaymentDate = await this.getGroupPaymentDate(groupId);
//
// 		const debtorRef = database.ref(db, `users/${uid}/paymentDone`);
// 		const studentPaymentInfo = await database.get(debtorRef);
// 		const studentPayment = studentPaymentInfo.toJSON();
// 		const lastPayment = new Date(studentPayment);
//
// 		const yearNow = lastPayment.getFullYear();
// 		const yearPayment = groupPaymentDate.getFullYear();
// 		const monthNow = lastPayment.getMonth();
// 		const monthPayment = groupPaymentDate.getMonth();
// 		const monthsAmount =
// 			(yearPayment - yearNow) * 12 + (monthPayment - monthNow);
// 		const today = new Date();
// 		today.setHours(4, 0, 0, 0);
// 		if (today.getTime() === groupPaymentDate.getTime()) {
// 			await database.update(ref, {
// 				monthsInDebt: monthsAmount,
// 			});
// 		}
// 	};
//
// 	getGroupPaymentDate = async (groupId) => {
// 		const db = database.getDatabase();
// 		const paymentRef = database.ref(db, `groups/${groupId}/paymentDate`);
// 		const paymentDate = await database.get(paymentRef);
// 		const dateRes = paymentDate?.toJSON();
// 		const date = new Date(dateRes?.split(/[./]+/).reverse().join("-"));
// 		return date;
// 	};
//
// 	updateDebtorPaymentInfo = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		const currentMonthsInDebt = await this.getMonthsInDebt(uid);
// 		const currentDate = new Date();
// 		const timePayed = new Date(currentDate).setDate(currentDate.getDate());
// 		let monthsAmount = 0;
// 		if (currentMonthsInDebt > 0) monthsAmount = currentMonthsInDebt - 1;
// 		await database.update(ref, {
// 			monthsInDebt: monthsAmount,
// 			paymentDone: timePayed,
// 		});
// 		if (currentMonthsInDebt === 0 || monthsAmount === 0)
// 			this.changeDebtorStatus(uid);
// 	};
//
// 	changeDebtorStatus = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		await database.update(ref, {
// 			debtor: false,
// 		});
// 		const debtor = `deleted`;
// 		return debtor;
// 	};
//
// 	setBeneficiaryStatus = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
//
// 		await database.update(ref, {
// 			beneficiary: true,
// 		});
// 	};
//
// 	deleteBeneficiaryStatus = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/beneficiary`);
//
// 		await database.remove(ref);
// 	};
//
// 	updateUserGroup = async (user, groupName, courseName, startDate) => {
// 		if (!user) return null;
// 		const currentGroup = user.groups.find((group) => group.course === courseName);
// 		if (!currentGroup) return null;
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${user.uid}`);
// 		const refGroupofStudents = database.ref(db, `groups/${groupName}/students`);
//
// 		const refUserinGroup = database.ref(db, `groups/${currentGroup.groupId}/students/${user.uid}`);
//
// 		if (currentGroup.groupId !== "group-unassigned" && currentGroup.groupId !== groupName) {
// 			await database.update(ref, { prevGroup: currentGroup.groupId });
// 		}
//
// 		await database.update(ref, { group: groupName, course: courseName });
// 		await database.update(refGroupofStudents, { [user.uid]: true });
// 		await database.remove(refUserinGroup);
//
// 		if (groupName === "group-unassigned") {
// 			const ref = database.ref(db, `users/${user.uid}/prevGroup`);
// 			await database.remove(ref);
// 		}
//
// 		this.setFirstPaymentDate(user.uid, startDate);
// 	};
//
// 	setUnseenWeeeks = async (uid, amount) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		await database.update(ref, { unseenWeeks: amount });
// 	};
//
// 	getBlocked = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/blockedWeek`);
// 		const data = await database.get(ref);
// 		const res = data?.toJSON();
// 		return res;
// 	};
//
// 	setQuestionnaireInfo = async (data) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${this.uid}`);
// 		const newRef = database.ref(db, `users/${this.uid}/newUser`);
//
// 		await database.update(ref, { questionnaireInfo: data });
// 		await database.remove(newRef);
// 	}
//
// 	setData(data) {
// 		let userGroups = [];
// 		let currentGroup = '';
// 		let userCourses = [];
// 		let currentCourse = '';
//
// 		if (typeof (data.group) === 'object') {
// 			userGroups = Object.entries(JSON.parse(JSON.stringify(data.group)))
// 				.map(([key, value]) => ({ groupId: key, ...value }))
// 				.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
// 			currentGroup = userGroups[0].groupId;
// 			userCourses = userGroups.map((group) => group.course);
// 			currentCourse = userCourses[0];
// 		} else {
// 			userGroups = [{ groupId: data.group, course: data.course }];
// 			currentGroup = data.group;
// 			userCourses = [data.course];
// 			currentCourse = data.course;
// 		}
//
// 		this.uid = data.uid;
// 		this.course = currentCourse;
// 		this.courses = userCourses || [];
// 		this.email = data.email;
// 		this.group = currentGroup;
// 		this.groups = userGroups || [];
// 		this.name = data.name;
// 		this.nickname = data.nickname;
// 		this.progress = data.progress || {};
// 		this.debtor = data.debtor;
// 		this.beneficiary = data.beneficiary;
// 		this.monthsInDebt = data.monthsInDebt;
// 		this.paymentDone = data.paymentDone;
// 		this.avatarURL = data.avatarURL;
// 		this.feedback = data.feedback;
// 		this.unseenWeeks = data.unseenWeeks || 0;
// 		this.status = data.status;
// 		this.personalMentor = data.personalMentor;
// 		this.blockedWeek = data.blockedWeek;
// 		this.newUser = data.newUser;
// 		this.questionnaireInfo = data.questionnaireInfo;
// 		this.achievement = data.achievement;
// 		this.isAnonymous = data.isAnonymous || false;
// 		this.unseenChats = data.unseenChats || 0;
// 		this.isUnchecked = data.isUnchecked || false;
// 	}
//
// 	setLoaded(value) {
// 		this.isLoaded = value;
// 	}
//
// 	addStudentAchievement = async (studentUid, course) => {
// 		const courseAchievement = new CourseStore();
// 		courseAchievement.id = course;
// 		await courseAchievement.loadData(course);
// 		const studentAchievement = courseAchievement.studentAchievement;
//
// 		for (const courseAchievementKey of Object.values(studentAchievement)) {
// 			courseAchievementKey.currentValue = 0;
// 		}
//
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(db, `users/${studentUid}`);
// 		const childRef = database.child(ref, `achievement`);
// 		await database.set(childRef, studentAchievement);
//
// 		return studentAchievement;
// 	}
//
// 	updateStudentAchievement = async (studentUid, block) => {
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(db, `users/${studentUid}/achievement/${block}`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		await database.update(ref, { currentValue: res.currentValue + 1 });
//
// 		runInAction(() => {
// 			this.achievement[block].currentValue = res.currentValue + 1;
// 		});
// 	}
//
// 	addNewAchievementBlock = async (studentUid, block, weekNumber) => {
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(db, `users/${studentUid}/achievement/${block}`);
// 		await database.update(ref, {
// 			currentValue: weekNumber,
// 			maximumValue: 28,
// 			id: block,
// 			title: "Настоящий боец!",
// 			description: "Пройти все практические недели обучения в ударном режиме!",
// 		});
//
// 		runInAction(() => {
// 			this.achievement[block] = {
// 				currentValue: weekNumber,
// 				maximumValue: 28,
// 				id: block,
// 				title: "Настоящий боец!",
// 				description: "Пройти все практические недели обучения в ударном режиме!",
// 			};
// 		});
// 	}
//
// 	sendUrgentNotice = async (recipientUid, senderRole, notifsData) => {
// 		const db = await database.getDatabase();
// 		const currentDate = new Date(Date.now());
// 		const timeSent = new Date(currentDate).setDate(currentDate.getDate());
//
// 		const noticeRef = await database.ref(db, `users/${recipientUid}/notifs`);
// 		const notice = {
// 			from: senderRole,
// 			text: notifsData.message,
// 			notice: notifsData.event,
// 			date: timeSent,
// 			seen: false,
// 			urgency: 1,
// 			topic: 'Важное сообщение',
// 			urgentNotices: true,
// 		};
// 		const notifBody = await database.push(noticeRef);
// 		await database.update(notifBody, notice);
// 	}
// }
