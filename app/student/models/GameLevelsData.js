
export default class GameLevelsData {

	/** @private {LessonsStore}*/
	#lessonsStore;

	/** @private {GroupsStore}*/
	#groupsStore;

	#profile;
	#today = new Date().setDate(new Date().getDate());
	#blockedWeek;

	constructor(weekBlocked, profile, lessonsStore, groupsStore) {
		this.#blockedWeek = weekBlocked;
		this.#profile = profile;
		this.#lessonsStore = lessonsStore;
		this.#groupsStore = groupsStore;
	}

	/**
	 *
	 * @returns {string}
	 */
	get currentLessonId() {
		const nextWeek = this.#profile?.nextWeek?.id
		const currentLesson = this.#group?.week?.id;
		return nextWeek && nextWeek?.split('-')[1] >= currentLesson?.split('-')[1]
			? nextWeek
			: currentLesson;
	}

	openLesson() {
		for (let task of this.#tasks) {
			if (this.#today >= task.dateStart || task.id === this.currentLessonId) {
				task.open = true;
			}
		}
	}

	/**
	 * @param {string} lessonId
	 * @returns {boolean}
	 */
	unblockLessons(lessonId) {
		const lesson = this.#tasks.find((item) => item.id === lessonId);
		let openLesson = false;
		if (lesson) {
			openLesson = lesson.open;
		}
		return openLesson;
	}

	// /**
	//  *
	//  * @returns {Array<Object>}
	//  */
	// get lessons() {
	// 	let currentLessons;
	// 	if (this.#blockedWeek > 0) {
	// 		currentLessons = this.#lessonsStore.lessons.filter(
	// 			(lesson) => lesson.weekNumber <= this.#blockedWeek
	// 		);
	// 	} else {
	// 		currentLessons = this.#lessonsStore.lessons;
	// 	}
	// 	return currentLessons;
	// }

	getLessons(courseName) {
		let lessonsInfo = this.#lessonsStore.allCourses[courseName]?.lessons;
		return Object.values(lessonsInfo || {});
	}
	get #group() {
		// const groupId = typeof (this.#profile.group) === 'string' ? this.#profile.group : Object.keys(this.#profile.group)[0];
		const groupId = this.#profile?.group;
		const group = this.#groupsStore.getGroup(groupId);
		return group;
	}
	get #tasks() {
		return Object.values(this.#group.schedule);
	}
	get course() {
		return this.#profile?.course;
	}
}
