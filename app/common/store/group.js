// import { async } from '@firebase/util';
// import { makeAutoObservable, runInAction } from 'mobx';
// import { database } from '../../modules/firebase';
// import { formatDate } from '../../modules/format-date';
// import getDateEndGroup from "../template/getDateEndGroup";
// import HometaskChatStore from './hometaskChat';
//
// export default class GroupStore {
// 	id = null;
//
// 	course = null;
//
// 	// name = null;
//
// 	mentor = {};
//
// 	schedule = {};
//
// 	startDate = null;
//
// 	endDate = null;
//
// 	paymentDate = null;
//
// 	dateStart = null;
//
// 	students = {};
//
// 	studentsList = {};
//
// 	isLoaded = false;
//
// 	// deadline = null;
//
// 	pausedLesson = null;
//
// 	bestStudents = null;
//
// 	bestHomework = null;
//
// 	archived = false;
//
// 	meetings = {};
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	/** Создание группы с предзаполненными данными */
// 	static createGroup(data, { isLoaded = false } = {}) {
// 		const store = new GroupStore();
// 		store.updateArchivedGroup(data);
// 		store.setData(data);
// 		store.setLoaded(isLoaded);
// 		return store;
// 	}
//
// 	addGroup = async ({
// 		nameGroup,
// 		nameCourse,
// 		mentor,
// 		mentorUid,
// 		mentorName,
// 		startDate,
// 		schedule,
// 	}) => {
// 		const result = {
// 			course: nameCourse,
// 			startDate: startDate,
// 			schedule: schedule,
// 			students: '',
// 			videos: '',
// 		};
// 		const db = database.getDatabase();
// 		const groupRef = database.ref(db, `groups`);
// 		const childRef = database.child(groupRef, nameGroup);
// 		const mentorRef = database.ref(
// 			db,
// 			`groups/${nameGroup}/mentor/${mentor}`
// 		);
// 		const mentorGroupsRef = database.ref(db, `mentors/${mentor}/groups`);
// 		const mentorsGroup = database.child(mentorGroupsRef, nameGroup);
// 		await database.set(mentorsGroup, {
// 			course: nameCourse,
// 			isMentor: true,
// 		});
//
// 		await database.set(childRef, result);
// 		await database.update(mentorRef, { uid: mentorUid, name: mentorName });
// 		this.setPaymentDate(nameGroup);
// 	};
//
// 	updateGroupDates = async (groupId, startDate, schedule) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}`);
// 		await database.update(ref, { startDate: startDate });
// 		if (schedule !== '') {
// 			await database.update(ref, { schedule: schedule });
// 		}
// 	};
//
// 	get week() {
// 		if (!this.isLoaded) {
// 			return null;
// 		}
//
// 		const now = new Date();
// 		const schedule = Object.values(this.schedule);
// 		let currentLesson = 0;
// 		let lastLessonInfo = schedule.find((item) => {
// 			return now <= item.dateEnd && now >= item.dateStart;
// 		});
// 		if (lastLessonInfo) {
// 			currentLesson = lastLessonInfo;
// 		} else {
// 			const allOpenedLessons = schedule
// 				.filter(
// 					(item) =>
// 						now >= item.dateStart)
// 				.sort(
// 					(lesson, nextLesson) => lesson.weekNumber - nextLesson.weekNumber
// 				);
//
// 			currentLesson = allOpenedLessons[allOpenedLessons.length - 1];
// 		}
// 		return currentLesson;
// 	}
//
// 	get openLessons() {
// 		if (!this.isLoaded) {
// 			return null;
// 		}
//
// 		const now = new Date();
// 		const schedule = Object.values(this.schedule);
// 		const lessons = schedule.filter((item) => now >= item.dateStart);
//
// 		return lessons;
// 	}
//
// 	updateStudentsCourse = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		await database.update(ref, { course: this.course });
// 	};
//
// 	//смена названия группы у студентов
// 	// updateStudentsGroup = async (uid) => {
// 	// 	const db = database.getDatabase();
// 	// 	const ref = database.ref(db, `users/${uid}`);
// 	// 	await database.update(ref, { group: this.name });
// 	// };
//
// 	updateCourse = async (course) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${this.id}`);
// 		await database.update(ref, { course: course });
// 		runInAction(() => (this.course = course));
// 		Object.keys(this.studentsList).forEach((student) => {
// 			this.updateStudentsCourse(student);
// 		});
// 	};
//
// 	// updateName = async (name)=>{
// 	// 	const db = database.getDatabase();
// 	// 	const ref = database.ref(db, `groups/${this.id}`);
// 	// 	await database.update(ref, { name: name });
// 	// 	runInAction(() => (this.name = name));
// 	// 	Object.keys(this.studentsList).forEach((student) => {
// 	// 		this.updateStudentsGroup(student);
// 	// 	});
// 	// }
//
// 	addMentor = async (
// 		addedMentor,
// 		groupId,
// 		mentorName,
// 		courseName,
// 		addedMentorUid,
// 		isHidden
// 	) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/mentor/${addedMentor}`);
//
// 		await database.update(ref, { uid: addedMentorUid, name: mentorName, isHidden });
//
// 		const mentorGroupsRef = database.ref(
// 			db,
// 			`mentors/${addedMentor}/groups`
// 		);
// 		const mentorsGroup = database.child(mentorGroupsRef, groupId);
// 		await database.set(mentorsGroup, {
// 			course: courseName,
// 			isMentor: true,
// 		});
// 	};
//
// 	deleteMentor = async (deleteMentor, groupId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`groups/${groupId}/mentor/${deleteMentor}`
// 		);
// 		const mentorGroupRef = database.ref(
// 			db,
// 			`mentors/${deleteMentor}/groups/${groupId}`
// 		);
// 		await database.remove(ref);
// 		await database.remove(mentorGroupRef);
// 	};
// 	/** Получаем список студентов группы */
//
// 	getStudents = async () => {
// 		const db = database.getDatabase();
// 		// const ref = database.query(
// 		// 	database.ref(db, 'users'),
// 		// 	database.orderByChild('group'),
// 		// 	database.equalTo(this.id)
// 		// );
// 		const ref = database.ref(db, 'users');
//
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		const filteredStudents = Object.fromEntries(Object.entries(res).filter(([key, value]) => {
// 			if (typeof value.group === 'object' && value.group[this.id]) {
// 				return true;
// 			}
// 			return value.group === this.id;
//
// 		}));
//
// 		let studentsList = filteredStudents || {};
// 		const hometaskChatStore = new HometaskChatStore();
//
// 		await Promise.all(Object.keys(studentsList).map(async (key) => {
// 			const unseenChats = await hometaskChatStore.getUnseenWeekly(key);
// 			if (unseenChats && Object.keys(unseenChats).length > 0) {
// 				studentsList[key].unseenChats = unseenChats
// 			} else {
// 				delete studentsList[key].unseenChats
// 			}
// 		}));
//
// 		runInAction(() => {
// 			this.studentsList = studentsList || {};
// 		});
// 	};
//
// 	getStudentsUnseenChats = async () => {
// 		const hometaskChatStore = new HometaskChatStore();
// 		const res = Object.keys(studentsList).map(async (key) => {
// 			return await hometaskChatStore.getUnseenWeekly(key);
// 		});
// 	};
//
// 	setBestStudents = async (lessonNum) => {
// 		const currentLessonsData = this.filterLessonsForMonth(lessonNum);
// 		const currentLessons = JSON.parse(JSON.stringify(currentLessonsData));
// 		const students = Object.keys(this.studentsList);
// 		const studentsCrystals = [];
// 		const db = database.getDatabase();
// 		for (let student of students) {
// 			const ref = database.ref(db, `progress/${student}/crystals`);
// 			const data = await database.get(ref);
// 			const res = data.toJSON();
// 			if (!res) {
// 				continue;
// 			}
// 			const currentCrystalsData = Object.entries(res)
// 				.map(([key, values]) => ({
// 					lessonId: key,
// 					...values,
// 				})).filter((item) => {
// 					return currentLessons.some((lesson) => lesson.id === item.lessonId);
// 				});
// 			const crystals = this.#countTotalCrystals(currentCrystalsData);
// 			studentsCrystals.push({ student: student, crystals: crystals });
// 		}
//
// 		let bestStudents = [];
//
// 		if (studentsCrystals.length > 0) {
// 			let max = 0;
// 			for (let i of studentsCrystals) {
// 				if (i.crystals >= max) max = i.crystals;
// 			}
// 			if (max) {
// 				bestStudents = studentsCrystals
// 					.filter((i) => i.crystals === max)
// 					.map((i) => i.student);
// 			}
// 		};
//
// 		if (!bestStudents.length) {
// 			return;
// 		}
//
// 		const reference = database.ref(
// 			db,
// 			`groups/${this.id}`
// 		);
// 		await database.update(reference, {
// 			bestStudents: bestStudents,
// 		});
// 		runInAction(() => {
// 			this.bestStudents = bestStudents;
// 		});
// 	};
//
// 	getBestHomework = async (group) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${group}/bestHomework`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON() || null;
// 		return res;
// 	};
//
// 	filterLessonsForMonth = (lessonNum) => {
// 		const lessonEndId = lessonNum - 1;
// 		const lessonStartId = lessonEndId - 3;
// 		const schedule = Object.values(this.schedule);
// 		const currentLessons = schedule.filter(
// 			(item) =>
// 				(lessonStartId <= item.lessonNumber || item.weekNumber) //todo
// 				&& (item.lessonNumber || item.weekNumber <= lessonEndId)
// 		);
// 		return currentLessons;
// 	};
//
// 	#countTotalCrystals = (currentCrystalsData) => {
// 		const hardSkillsAmount = currentCrystalsData
// 			.map((crystal) => {
// 				return crystal.hardSkills;
// 			})
// 			.reduce((a, b) => a + b, 0);
//
// 		const softSkillsAmount = currentCrystalsData
// 			.map((crystal) => {
// 				return crystal.softSkills;
// 			})
// 			.filter((crystals) => crystals !== undefined)
// 			.reduce((a, b) => a + b, 0);
// 		const totalCrystals = hardSkillsAmount + softSkillsAmount;
// 		return totalCrystals;
// 	};
//
// 	moveUser = async (
// 		uid,
// 		textInputName,
// 		selectGroupValue,
// 		selectCourseValue,
// 		isBlocked,
// 		lesson,
// 	) => {
// 		const db = database.getDatabase();
// 		const userRef = database.ref(db, `users/${uid}`);
//
// 		const nameRef = database.ref(db, `users/${uid}/name`);
// 		const dataName = await database.get(nameRef);
// 		const userName = dataName.toJSON();
//
// 		const groupRef = database.ref(db, `users/${uid}/group`);
// 		const dataGroup = await database.get(groupRef);
// 		const userGroup = dataGroup.toJSON();
//
// 		const courseRef = database.ref(db, `users/${uid}/course`);
// 		const dataCourse = await database.get(courseRef);
// 		const userCourse = dataCourse.toJSON();
//
// 		const blockedRef = database.ref(db, `users/${uid}/blockedLesson`);
// 		const dataBlocked = await database.get(blockedRef);
// 		const userBlocked = dataBlocked.toJSON();
//
// 		const refGroupofStudents = database.ref(
// 			db,
// 			`groups/${selectGroupValue}/students`
// 		);
// 		const refUserinGroup = database.ref(
// 			db,
// 			`groups/${userGroup}/students/${uid}`
// 		);
//
// 		if (userName !== textInputName) {
// 			await database.update(userRef, {
// 				name: textInputName,
// 			});
// 		}
//
// 		if (
// 			userGroup !== 'group-unassigned' &&
// 			userGroup !== selectGroupValue
// 		) {
// 			await database.update(userRef, {
// 				prevGroup: userGroup,
// 			});
// 		}
// 		if (userGroup !== selectGroupValue) {
// 			await database.update(userRef, {
// 				group: selectGroupValue,
// 			});
// 			await database.update(refGroupofStudents, { [uid]: true });
// 			await database.remove(refUserinGroup);
// 		}
//
// 		if (userCourse !== selectCourseValue) {
// 			await database.update(userRef, {
// 				course: selectCourseValue,
// 			});
// 		}
//
// 		if (isBlocked === 'true') {
// 			await database.update(userRef, {
// 				blockedLesson: lesson,
// 			});
// 		}
//
// 		if (isBlocked === 'false' && userBlocked) {
// 			await database.remove(blockedRef);
// 		}
// 	};
//
// 	removeUser = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
//
// 		await database.remove(ref);
// 	};
//
// 	// moveVideo = async (textInputTheme, textInputLink, groupId) => {
// 	// 	const db = database.getDatabase();
// 	// 	const ref = database.ref(db, `groups/${groupId}/videos`);
//
// 	// 	const themeRef = database.ref(db, `groups/${groupId}/videos/theme`);
// 	// 	const dataTheme = await database.get(themeRef);
// 	// 	const videoTheme = dataTheme.toJSON();
//
// 	// 	const linkRef = database.ref(db, `groups/${groupId}/videos/link`);
// 	// 	const dataLink = await database.get(linkRef);
// 	// 	const videoLink = dataLink.toJSON();
//
// 	// 	if (videoTheme !== textInputTheme) {
// 	// 		await database.update(ref, {
// 	// 			theme: textInputTheme,
// 	// 		});
// 	// 	}
// 	// 	if (videoLink !== textInputLink) {
// 	// 		await database.update(ref, {
// 	// 			link: textInputLink,
// 	// 		});
// 	// 	}
// 	// };
//
// 	addMeetings = async (meetingsObj) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${this.id}/meetings`);
// 		await database.set(ref, meetingsObj);
//
// 		runInAction(() => {
// 			this.meetings = meetingsObj;
// 		});
// 	}
//
// 	deleteMeeting = async (meetingId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${this.id}/meetings/${meetingId}`);
// 		await database.remove(ref);
//
// 		runInAction(() => {
// 			delete this.meetings[meetingId];
// 		});
// 	}
//
// 	updateMeeting = async (meetingId, meetingObj) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${this.id}/meetings/${meetingId}`);
// 		await database.update(ref, meetingObj);
//
// 		runInAction(() => {
// 			this.meetings[meetingId] = meetingObj;
// 		});
// 	}
//
// 	addVideo = async (groupId, videoData, meetingId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/meetings/${meetingId}/videos`);
//
// 		const currentDate = new Date();
// 		const timeUploaded = new Date(currentDate).setDate(
// 			currentDate.getDate()
// 		);
// 		const newVideo = database.push(ref);
// 		await database.update(newVideo, {
// 			...videoData,
// 			uploaded: timeUploaded,
// 		});
// 	};
//
// 	removeVideo = async (groupId, videoId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/videos/${videoId}`);
//
// 		await database.remove(ref);
// 	};
//
// 	setPaymentDate = async (groupId) => {
// 		if (groupId === 'group-unassigned') {
// 			return;
// 		}
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(db, `groups/${groupId}`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		if (!res) {
// 			return;
// 		}
//
// 		const today = new Date();
// 		const endGroup = new Date(getDateEndGroup(res.schedule));
//
// 		if (!res.paymentDate) {
// 			const paymentDateInfo = new Date(res.startDate);
// 			paymentDateInfo.setMonth(paymentDateInfo.getMonth() + 1);
// 			const paymentDate = paymentDateInfo.toLocaleDateString();
//
// 			await database.update(ref, {
// 				paymentDate: paymentDate,
// 			});
// 		}
// 		else if (today.getTime() - endGroup.getTime() < 0) {
// 			await this.updatePaymentDate(groupId);
// 		}
// 		else {
// 			return;
// 		}
// 	};
//
// 	updateGroupPaymentDate = async (groupId, groupPaymentDate) => {
// 		if (!groupPaymentDate || !groupId) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}`);
// 		const groupRef = database.ref(db, `groups/${groupId}/paymentDate`);
// 		const data = await database.get(groupRef);
// 		const currentGroupPayDate = data.toJSON();
// 		const newGroupPayDate = new Date(
// 			groupPaymentDate?.split('.').reverse().join('-')
// 		);
// 		const updatedGroupPayDate = formatDate(newGroupPayDate);
// 		if (currentGroupPayDate !== updatedGroupPayDate) {
// 			await database.update(ref, {
// 				paymentDate: updatedGroupPayDate,
// 			});
// 		} else {
// 			return;
// 		}
// 	};
//
// 	updatePaymentDate = async (groupId) => {
// 		const today = new Date();
// 		const db = database.getDatabase();
// 		const groupRef = database.ref(db, `groups/${groupId}`);
// 		const ref = database.ref(db, `groups/${groupId}/paymentDate`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		const currentPayD = new Date(res?.split('.').reverse().join('-'));
// 		const newPayD = new Date(res?.split('.').reverse().join('-'));
// 		if (today.getTime() - currentPayD.getTime() >= 86400000) {
// 			newPayD.setMonth(newPayD.getMonth() + 1);
// 			const updatedPayD = formatDate(newPayD);
// 			await database.update(groupRef, {
// 				paymentDate: updatedPayD,
// 			});
// 		} else {
// 			return;
// 		}
// 	};
//
// 	getPaymentDate = async (groupId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/paymentDate`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		return res;
// 	};
//
// 	setData = (data) => {
// 		this.id = data.id;
// 		this.course = data.course;
// 		// this.name = data.name;
// 		this.mentor = data.mentor || {};
// 		this.schedule = data.schedule || {};
// 		this.startDate = data.startDate;
// 		this.endDate = data.endDate;
// 		this.students = data.students || {};
// 		this.paymentDate = data.paymentDate;
// 		this.pausedLesson = data.pausedLesson;
// 		this.archived = data.archived || false;
// 		this.bestHomework = data.bestHomework;
// 		this.bestStudents = data.bestStudents;
// 		this.meetings = data.meetings || {};
// 	}
//
// 	setLoaded = (value) => {
// 		this.isLoaded = value;
// 	};
//
// 	setArchived = async (groupId, archived) => {
// 		this.archived = archived;
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}`);
// 		await database.update(ref, { archived: archived });
// 	};
//
// 	updateArchivedGroup = async (group) => {
// 		const now = new Date();
// 		if (new Date(group.endDate) < new Date(now) && !group.archived) {
// 			this.setArchived(group.id, true);
// 			group.archived = true;
// 		}
// 	};
//
// 	/** Загрузка данных группы */
//
// 	loadData = async () => {
// 		if (this.isLoaded) {
// 			return;
// 		}
//
// 		if (!this.id) {
// 			return;
// 		}
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${this.id}`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		res.id = this.id;
// 		this.setData(res);
// 		this.setLoaded(true);
// 	};
//
// 	getSchedule = async (groupId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/schedule`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		return res;
// 	};
//
// 	removePausedLesson = async (groupId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/pausedLesson`);
// 		await database.remove(ref);
// 		runInAction(() => {
// 			this.pausedLesson = null;
// 		})
// 	};
//
// 	setVacation = async (groupId, weekNumber) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/pausedLesson`);
// 		await database.set(ref, weekNumber);
// 	}
//
// 	setUpdatedSchedule = async (groupId, schedule, type) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/schedule`);
// 		type === 'vacations'
// 			? await database.update(ref, schedule)
// 			: await database.set(ref, schedule);
//
// 		runInAction(() => {
// 			this.schedule = schedule
// 		});
// 	};
//
// 	setPausedLesson = async (groupId, lessonNum) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}`);
// 		await database.update(ref, { pausedLesson: lessonNum });
// 		runInAction(() => {
// 			this.pausedLesson = lessonNum;
// 		})
// 	};
// }
