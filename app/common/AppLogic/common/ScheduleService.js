import {makeAutoObservable} from "mobx";

export default class ScheduleService {

	/** @private {LessonsStore}*/
	#lessonsStore;
	/** @private {GroupStore}*/
	#oneGroupStore;


	constructor(lessonsStore, oneGroupStore) {
		this.#lessonsStore = lessonsStore;
		this.#oneGroupStore = oneGroupStore;
		makeAutoObservable(this);
	}

	async calculateSchedule(course, courseStart, groupHolidays = []) {
		if (!courseStart) {
			return;
		}

		const schedule = {};
		await this.#lessonsStore.loadData(course);
		const lessons = Object.values(this.#lessonsStore.lessons).sort(
			(a, b) => a.lessonNumber - b.lessonNumber
		);

		const interval = await this.#getInterval(course);

		let previousBlock = undefined;
		let dateCursor = new Date(courseStart);
		const holidaysBeforeBlocks = Object.fromEntries(groupHolidays);
		for (let lesson of lessons) {
			if (lesson.block !== previousBlock) {
				const holidaysDuration = holidaysBeforeBlocks[lesson.block] || 0;
				dateCursor.setDate(dateCursor.getDate() + holidaysDuration);
			}

			const lessonStart = dateCursor.getTime();
			dateCursor.setDate(dateCursor.getDate() + interval);
			const lessonEnd = dateCursor.getTime();

			schedule[lesson.id] = {
				id: lesson.id,
				weekNumber: lesson.lessonNumber,
				block: lesson.block,
				dateStart: lessonStart,
				dateEnd: lessonEnd,
				open: false,
			};

			previousBlock = lesson.block;
		}
		return schedule;
	};

	async updateSchedule(lessonNumber, pausedLessonNum, lessonStart){
		const interval = await this.#getInterval(this.#oneGroupStore.course);

		const schedule = Object.values(this.#oneGroupStore.schedule);

		let scheduleUpdated = {};
		const filteredSchedule = schedule
			.filter((lesson) =>lesson.weekNumber >= lessonNumber || lesson.dateStart >= lessonStart)
			.sort((a, b) => a.weekNumber - b.weekNumber);

		for (let lesson of filteredSchedule) {
			let updateDateStart = '';
			if (lesson.weekNumber === lessonNumber) {
				updateDateStart = lesson.dateStart;
			} else {
				const startLesson = new Date(lesson.dateStart);
				updateDateStart = startLesson.setDate(
					startLesson.getDate() + pausedLessonNum * interval
				);
			}
			const endLesson = new Date(lesson.dateEnd);
			const updateDateEnd = endLesson.setDate(endLesson.getDate() + +pausedLessonNum * interval);
			scheduleUpdated[lesson.id] = {
				...lesson,
				dateStart: updateDateStart,
				dateEnd: updateDateEnd,
			};
		}
		await this.#oneGroupStore.setUpdatedSchedule(this.#oneGroupStore.id, scheduleUpdated, 'vacations');
		await this.#oneGroupStore.setPausedLesson(this.#oneGroupStore.id, lessonNumber);
	};

	deletePausedLesson = async () => {
		const interval = await this.#getInterval(this.#oneGroupStore.course);

		await this.#oneGroupStore.loadData();
		const scheduleInfo = Object.values(this.#oneGroupStore.schedule);
		const lessonNumber = this.#oneGroupStore.pausedLesson;

		let scheduleUpdated = {};
		const filteredSchedule = scheduleInfo
			.filter((lesson) => lesson.weekNumber >= lessonNumber)
			.sort((a, b) => a.weekNumber - b.weekNumber);

		let backGap = '';

		for (let lesson of filteredSchedule) {
			let updateDateStart = '';
			let updateDateEnd = '';
			if (lesson.weekNumber === lessonNumber) {
				updateDateStart = lesson.dateStart;
				updateDateEnd = updateDateStart + interval * 24 * 60 * 60 * 1000;
				backGap = lesson.dateEnd - updateDateEnd;
			} else {
				updateDateStart = lesson.dateStart - backGap;
				updateDateEnd = lesson.dateEnd - backGap;
			}
			scheduleUpdated[lesson.id] = {
				...lesson,
				dateStart: updateDateStart,
				dateEnd: updateDateEnd,
			};
		}
		await this.#oneGroupStore.setUpdatedSchedule(this.#oneGroupStore.id, scheduleUpdated, 'vacations');
		await this.#oneGroupStore.removePausedLesson(this.#oneGroupStore.id);
	};

	async #getInterval(course) {
		await this.#lessonsStore.loadData(course);
		const lessons = Object.values(this.#lessonsStore.lessons)
		const interval = lessons[1]?.accessInterval || 7;
		return interval;
	}
}
