// import { makeAutoObservable, runInAction } from 'mobx';
// import { database } from '../../modules/firebase';
// import HometaskChatStore from "./hometaskChat";
// import capitalizeFirstLetter from "../template/capitalizeFirstLetter";
// import Enum from "../../enum";
//
// export default class MentorStore {
// 	id = null;
//
// 	uid = null;
//
// 	companies = '';
//
// 	courses = {};
//
// 	blocks = {};
//
// 	priorityBlock = '';
//
// 	education = '';
//
// 	experience = '';
//
// 	generalInfo = '';
//
// 	keyCompetence = '';
//
// 	homeworks = {};
//
// 	name = '';
//
// 	specialization = '';
//
// 	isLoaded = false;
//
// 	groups = {};
//
// 	uid = '';
//
// 	checkedTasks = {};
//
// 	mentorStudents = {};
//
// 	blockedGroups = {};
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	/** Создание группы с предзаполненными данными */
//
// 	static createMentor(data, { isLoaded = false } = {}) {
// 		const store = new MentorStore();
// 		store.setData(data);
// 		store.setLoaded(isLoaded);
// 		return store;
// 	}
//
// 	addMentor = async ({
// 		id,
// 		uid,
// 		name,
// 		email,
// 		courses,
// 		companies,
// 		experience,
// 		education,
// 		specialization,
// 		password,
// 	}) => {
// 		const coursesData = courses.map((course) => {
// 			const id = course;
// 			const courseName = capitalizeFirstLetter(course);
// 			return {
// 				id,
// 				'course-name': `${courseName}-разработчик`,
// 			};
// 		});
// 		const result = {
// 			name: name,
// 			// email: email,
// 			courses: coursesData,
// 			companies: companies,
// 			experience: experience,
// 			groups: '',
// 			education: education,
// 			specialization: specialization,
// 			uid: uid,
// 			blockedGroups: '',
// 			// password: password,
// 		};
// 		const db = database.getDatabase();
// 		const mentorRef = database.ref(db, `mentors`);
// 		const childRef = database.child(mentorRef, `mentor-${id}`);
// 		await database.set(childRef, result);
// 	};
//
// 	// удаление ментора из БД
// 	deleteMentorFromDB = async () => {
// 		if (!this.id) {
// 			return
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `mentors/${this.id}`);
// 		await database.remove(ref);
// 	};
//
// 	setData(data) {
// 		this.id = data.id;
// 		this.uid = data.uid;
//
// 		this.companies = data.companies || '';
// 		this.courses = data.courses || {};
// 		this.courses = Object.entries(this.courses).map(([key, value]) => ({
// 			id: key,
// 			...value,
// 		}));
// 		this.education = data.education || '';
// 		this.blocks = this.#calculateBlocks(data.blocks) || {};
// 		this.experience = data.experience || '';
// 		this.homeworks = data.homeworks || {};
// 		this.generalInfo = data.generalInfo || '';
// 		this.keyCompetence = data.keyCompetence || '';
// 		this.name = data.name || '';
// 		this.specialization = data.specialization || '';
// 		this.groups = data.groups || {};
// 		this.uid = data.uid || '';
// 		this.checkedTasks = data.checkedTasks || {};
// 		this.mentorStudents = data.students || {};
// 		this.blockedGroups = data.blockedGroups || {};
// 	}
//
// 	setLoaded(value) {
// 		this.isLoaded = value;
// 	}
//
// 	/** Загрузка данных одной наставницы */
//
// 	loadData = async () => {
// 		if (this.isLoaded || !this.id) {
// 			return;
// 		}
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `mentors/${this.id}`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		res.id = this.id;
//
// 		this.setData(res);
// 		this.setLoaded(true);
//
// 		if (!res) {
// 			return;
// 		}
// 	};
//
// 	getHomeworks = async (mentorId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `mentors/${mentorId}/homeworks`);
//
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		if (res !== null) {
// 			Object.values(res).forEach(homework => {
// 				let hometaskChatStore = new HometaskChatStore();
// 				hometaskChatStore.loadHomeworkStatus(homework.uid, homework.taskId);
// 				homework.status = hometaskChatStore;
// 			});
// 		}
//
// 		runInAction(() => {
// 			this.homeworks = res || {};
// 		});
// 	};
//
// 	updateMentorModules = async (mentorId, blocks) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `mentors/${mentorId}`);
// 		await database.update(ref, { blocks: blocks });
// 		runInAction(() => (this.blocks = blocks));
// 	};
//
// 	setPriorityModule = async (mentorId, block) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `mentors/${mentorId}/blocks/${block}`);
// 		await database.update(ref, { priority: true });
// 		runInAction(() => {
// 			this.priorityBlock = block;
// 		});
// 	};
//
// 	getCurrentMonth = () => {
// 		const monthEndDate = Enum.monthEndDate;
// 		const now = new Date();
// 		const currentDate = now.getDate();
// 		const month = currentDate < monthEndDate ? now.getMonth() + 1 : now.getMonth() + 2;
// 		return month;
// 	}
//
// 	updateCheckedAmount = async (block) => {
// 		const db = database.getDatabase();
//
// 		const month = this.getCurrentMonth();
// 		const monthsRef = database.ref(db, `mentors/${this.id}/checkedTasks`);
// 		const monthsData = await database.get(monthsRef);
// 		const monthsRes = monthsData.toJSON();
//
// 		if (monthsRes && Object.keys(monthsRes).length > 3) {
// 			const prevMonth = month === 1 ? 12 : month - 1;
// 			const prevPrevMonth = prevMonth === 1 ? 12 : prevMonth - 1;
// 			Object.keys(monthsRes)
// 				.filter(monthNum => +monthNum !== month && +monthNum !== prevMonth && +monthNum !== prevPrevMonth)
// 				.map(monthNum => this.resetCheckedAmount(monthNum))
// 		}
//
// 		const ref = database.ref(
// 			db,
// 			`mentors/${this.id}/checkedTasks/${month}/${block}`
// 		);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		const amountValue = res ? res.amount + 1 : 1;
// 		await database.update(ref, { amount: amountValue });
//
// 		runInAction(() => {
// 			this.checkedTasks ??= {};
// 			this.checkedTasks[month] ??= {};
// 			this.checkedTasks[month][block] = {
// 				amount: amountValue,
// 			};
// 			this.isLoaded = false;
// 		});
// 	};
//
// 	putHomeworkToMentor = async (mentorId, homeworkId, homework) => {
// 		const db = database.getDatabase();
// 		const refHomework = database.ref(
// 			db,
// 			`mentors/${mentorId}/homeworks/${homeworkId}`
// 		);
// 		await database.update(refHomework, {
// 			...homework,
// 		});
//
// 		runInAction(() => {
// 			let hometaskChatStore = new HometaskChatStore();
// 			hometaskChatStore.loadHomeworkStatus(homework.uid, homework.taskId);
// 			this.homeworks[homeworkId] = {
// 				...homework,
// 				status: hometaskChatStore,
// 			};
// 		});
// 	};
//
// 	deleteHomeworkFromMentor = async (mentorId, homeworkId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`mentors/${mentorId}/homeworks/${homeworkId}`
// 		);
// 		await database.remove(ref);
// 		this.isLoaded = true;
//
// 		runInAction(() => {
// 			delete this.homeworks[homeworkId];
// 		});
// 	};
//
// 	resetCheckedAmount = async (month) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `mentors/${this.id}/checkedTasks/${month}`);
// 		await database.remove(ref);
// 	};
//
// 	addStudentToMentor = async (mentorId, studentUid) => {
// 		const now = (new Date).getTime();
// 		const month = 30 * 24 * 60 * 60 * 1000;
// 		const removalDate = now - 2 * month;
// 		const newStudents = Object.fromEntries(
// 			Object.entries(this.mentorStudents)
// 				.filter(([studentUid, studentData]) => studentData.lastCheckDate >= removalDate)
// 		);
// 		newStudents[studentUid] = {
// 			numberOfHomeworkChecks: 1,
// 			lastCheckDate: new Date().getTime(),
// 		};
// 		const db = await database.getDatabase();
// 		const studentsRef = await database.ref(db, `mentors/${mentorId}/students`);
// 		await database.set(studentsRef, newStudents);
//
// 		runInAction(() => {
// 			this.mentorStudents = newStudents;
// 		});
// 	}
//
// 	getMentorStudents = async (mentorId) => {
// 		const db = await database.getDatabase();
// 		const studentsRef = await database.ref(db, `mentors/${mentorId}/students`);
// 		const studentsData = await database.get(studentsRef);
// 		const res = studentsData.toJSON();
//
// 		let students;
// 		if (res !== null) {
// 			students = res;
// 		}
//
// 		runInAction(() => {
// 			this.mentorStudents = students || {};
// 		});
// 	}
//
// 	addCheckedHomeworkToStudent = async (mentorId, studentUid) => {
// 		const db = await database.getDatabase();
// 		const studentRef = await database.ref(db, `mentors/${mentorId}/students/${studentUid}`);
// 		const studentsData = await database.get(studentRef);
// 		const res = studentsData.toJSON();
// 		await database.set(studentRef, {
// 			numberOfHomeworkChecks: res.numberOfHomeworkChecks + 1,
// 			lastCheckDate: new Date().getTime(),
// 		});
//
// 		runInAction(() => {
// 			this.mentorStudents[studentRef] = {
// 				numberOfHomeworkChecks: res.numberOfHomeworkChecks + 1,
// 				lastCheckDate: new Date().getTime(),
// 			};
// 		});
// 	};
//
// 	addStudentToMentorList = async (currentMentor, homeworkObj) => {
// 		const mentorStudents = Object.keys(this.mentorStudents);
// 		if (!mentorStudents.includes(homeworkObj.uid)) {
// 			await this.addStudentToMentor(currentMentor.id, homeworkObj.uid);
// 		}
// 		if (mentorStudents.includes(homeworkObj.uid)) {
// 			await this.addCheckedHomeworkToStudent(
// 				currentMentor.id,
// 				homeworkObj.uid
// 			);
// 		}
// 	}
//
// 	#calculateBlocks(blocks) {
// 		if (blocks === undefined) {
// 			blocks = {};
// 		}
// 		let block = blocks['HTML CSS'];
// 		if (block === undefined) {
// 			block = {
// 				name: "HTML CSS",
// 				priority: false,
// 			};
// 			blocks['HTML CSS'] = block;
// 		}
// 		return blocks;
// 	};
//
// 	setBlockedGroups = async (mentorId, groups) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `mentors/${mentorId}`);
// 		await database.update(ref, { blockedGroups: groups });
// 		runInAction(() => {
// 			this.blockedGroups = groups;
// 		});
// 	}
// }
