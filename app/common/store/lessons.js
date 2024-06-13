// import { async } from '@firebase/util';
// import { makeAutoObservable } from 'mobx';
// import { database } from '../../modules/firebase';
// import LessonStore from './lesson';
//
// export default class LessonsStore {
// 	allCourses = {}
//
// 	lessons = [];
//
// 	isLoaded = false;
//
// 	progress = null;
//
// 	userValues = null;
//
// 	countCrystal = 0;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
// 	loadDataAllCourse = async() => {
// 		if (this.isLoaded) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `courses`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		this.allCourses = res;
// 		this.setLoaded(true);
// 	}
//
// 	loadData = async (course) => {
// 		if (!course) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `courses/${course}/lessons`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		this.setLessons(res);
// 		this.setLoaded(true);
// 	};
//
// 	getLesson = (id) => {
// 		let lesson = null;
//
// 		lesson = this.lessons.find((item) => item.id === id);
//
// 		if (!lesson) {
// 			lesson = this.addLesson(id);
// 		}
//
// 		return lesson;
// 	};
//
// 	setGroupSchedule = async (
// 		course,
// 		startDate,
// 		blockGaps = [],
// 		jobWeek,
// 		jobDuration
// 	) => {
// 		const schedule = {};
// 		if (!startDate) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `courses/${course}/lessons`);
// 		const data = await database.get(ref);
// 		const weeksInfo = data.toJSON();
// 		const weeks = Object.values(weeksInfo).sort(
// 			(a, b) => a.weekNumber - b.weekNumber
// 		);
//
// 		let gap = 0;
// 		let jobStart;
//
// 		for (let week of weeks) {
// 			let dateStart = '';
// 			let dateEnd = '';
//
// 			const start = new Date(startDate);
// 			const end = new Date(startDate);
// 			const eD = end.setDate(end.getDate() + 7);
//
// 			const num = week.weekNumber;
// 			const weekId = week.id;
// 			const blockName = week.block;
//
// 			if (course !== 'frontend' && course !== 'mobile') {
// 				if (num === jobWeek + 1) {
// 					gap += jobDuration;
// 				}
//
// 				if (
// 					week.startModule &&
// 					num !== 1 &&
// 					blockName !== 'Трудоустройство'
// 				) {
// 					for (let i = 0; i < blockGaps.length; i++) {
// 						if (blockGaps[i][0] === blockName) {
// 							gap += blockGaps[i][1];
// 							break;
// 						}
// 					}
// 				}
// 			}
// 			let startNum = num - 1;
// 			if (num === 1) {
// 				dateStart = Date.parse(start);
// 			} else {
// 				dateStart = start.setDate(
// 					start.getDate() + startNum * 7 + gap * 7
// 				);
// 			}
// 			dateEnd = end.setDate(end.getDate() + startNum * 7 + gap * 7);
//
// 			if (num === jobWeek) {
// 				jobStart = dateEnd;
// 			}
//
// 			let weekInfo = {
// 				id: weekId,
// 				weekNumber: num,
// 				block: blockName,
// 				dateStart,
// 				dateEnd,
// 				open: false,
// 			};
// 			schedule[weekId] = weekInfo;
// 		}
// 		const jobWeeks = Object.values(schedule).filter(
// 			(el) => el.block === 'Трудоустройство'
// 		);
// 		if (course !== 'frontend' && course !== 'mobile') {
// 			jobWeeks.forEach((week, index) => {
// 				let dateStart = '';
// 				let dateEnd = '';
//
// 				const jobEnd = jobStart + 7 * 24 * 3600000;
//
// 				const weekId = week.id;
//
// 				dateStart = jobStart + index * 7 * 24 * 3600000;
// 				dateEnd = jobEnd + index * 7 * 24 * 3600000;
//
// 				schedule[weekId]['dateStart'] = dateStart;
// 				schedule[weekId]['dateEnd'] = dateEnd;
// 			});
// 		}
//
// 		return schedule;
// 	};
//
// 	updateSchedule = async (groupId, weekNumber, num, weekStart) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/schedule`);
// 		const data = await database.get(ref);
// 		const scheduleData = data.toJSON();
// 		const scheduleInfo = Object.values(scheduleData);
//
// 		let scheduleUpdated = {};
// 		const filteredSchedule = scheduleInfo.filter(
// 			(week) =>
// 				week.weekNumber >= weekNumber || week.dateStart >= weekStart
// 		);
//
// 		for (let week of filteredSchedule) {
// 			let updateDateStart = '';
// 			if (week.weekNumber === weekNumber) {
// 				updateDateStart = week.dateStart;
// 			} else {
// 				const startWeek = new Date(week.dateStart);
// 				updateDateStart = startWeek.setDate(
// 					startWeek.getDate() + num * 7
// 				);
// 			}
// 			const endWeek = new Date(week.dateEnd);
// 			const updateDateEnd = endWeek.setDate(endWeek.getDate() + num * 7);
// 			scheduleUpdated[week.id] = {
// 				...week,
// 				dateStart: updateDateStart,
// 				dateEnd: updateDateEnd,
// 			};
// 		}
// 		this.setUpdatedSchedule(groupId, scheduleUpdated);
// 		this.setPausedWeek(groupId, weekNumber);
// 	};
//
// 	setUpdatedSchedule = async (groupId, schedule) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/schedule`);
// 		await database.update(ref, schedule)
// 	};
//
// 	setPausedWeek = async (groupId, weekNum) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}`);
// 		await database.update(ref, { pausedWeek: weekNum });
// 	};
//
// 	removePausedWeek = async (groupId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/pausedWeek`);
//
// 		await database.remove(ref);
// 	};
//
// 	setLoaded = (value) => {
// 		this.isLoaded = value;
// 	}
//
// 	addLesson(id) {
// 		const lesson = LessonStore.createLesson({ id }, { isLoaded: false });
// 		this.lessons.push(lesson);
// 		this.lessons.slice().sort((a, b) => a.lessonNumber - b.lessonNumber);
//
// 		return lesson;
// 	}
//
// 	setLessons(lessons) {
// 		if (!lessons) {
// 			lessons = {};
// 		}
//
// 		this.lessons = Object.entries(lessons)
// 			.map(([key, value]) =>
// 				LessonStore.createLesson({
// 					...value,
// 					id: key,
// 				})
// 			)
// 			.sort((a, b) => a.lessonNumber - b.lessonNumber);
// 	}
//
// 	getTest = async (course, id) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `courses/${course}/tests/${id}`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		return res;
// 	};
//
// 	setProgress(progress) {
// 		this.progress = progress;
// 	}
//
// 	setUserValues(values) {
// 		this.userValues = values;
// 	}
//
// 	getTasks = async (course, lessonId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`courses/${course}/lessons/${lessonId}/tasks`
// 		);
// 		const tasksData = await database.get(ref);
// 		const tasks = tasksData.toJSON();
//
// 		return tasks;
// 	};
//
// 	getCrystalsLessonTask = async (userId, taskType, taskId) => {
// 		const db = database.getDatabase();
// 		let typeOfTask = taskType;
// 		if (taskType === 'soft-skills') {
// 			typeOfTask = 'practice';
// 		}
// 		const ref = database.ref(
// 			db,
// 			`progress/${userId}/${typeOfTask}/${taskId}`
// 		);
// 		const data = await database.get(ref);
// 		const crystallData = data.toJSON();
// 		let crystal = false;
// 		const extraTask = crystallData?.isExtra || false;
// 		if (!crystallData?.isCrystal) {
// 			crystal = false;
// 		} else {
// 			crystal = true;
// 			this.countCrystal++;
// 		}
// 		return { crystal, extraTask };
// 	};
//
// 	getBlocks = async (course) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `courses/${course}/lessons`);
// 		const data = await database.get(ref);
// 		const lessonsInfo = data.toJSON();
// 		const lessons = Object.values(lessonsInfo || {});
// 		return [...new Set(lessons.map((lesson) => lesson.block))];
// 	};
//
// 	deletePausedLesson = async (groupId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${groupId}/schedule`);
// 		const data = await database.get(ref);
// 		const scheduleData = data.toJSON();
// 		const scheduleInfo = Object.values(scheduleData);
//
// 		const refWeek = database.ref(db, `groups/${groupId}`);
// 		const dataWeek = await database.get(refWeek);
// 		const weekNumberData = dataWeek.toJSON();
// 		const weekNumber = weekNumberData.pausedWeek;
//
// 		let scheduleUpdated = {};
// 		const filteredSchedule = scheduleInfo.filter(
// 			(week) => week.weekNumber >= weekNumber
// 		);
//
// 		let backGap = '';
//
// 		for (let week of filteredSchedule) {
// 			let updateDateStart = '';
// 			let updateDateEnd = '';
// 			if (week.weekNumber === weekNumber) {
// 				updateDateStart = week.dateStart;
// 				updateDateEnd = updateDateStart + 7 * 24 * 60 * 60 * 1000;
// 				backGap = week.dateEnd - updateDateEnd;
// 			} else {
// 				updateDateStart = week.dateStart - backGap;
// 				updateDateEnd = week.dateEnd - backGap;
// 			}
// 			scheduleUpdated[week.id] = {
// 				...week,
// 				dateStart: updateDateStart,
// 				dateEnd: updateDateEnd,
// 			};
// 		}
// 		this.setUpdatedSchedule(groupId, scheduleUpdated);
// 		this.removePausedWeek(groupId);
// 	};
// }
