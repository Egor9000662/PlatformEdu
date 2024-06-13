export default class NotionPageData {
	/**@private {FeedbackStore}*/
	#feedbackStore;
	#group;
	#weekId;
	#lesson;
	#profile;
	#student;

    constructor(group, weekId, lesson, profile, student, feedbackStore) {
		this.#group = group;
		this.#weekId = weekId;
		this.#lesson = lesson;
		this.#profile = profile;
		this.#student = student;
		this.#feedbackStore = feedbackStore;
	}

	get deadlineOverdue() {
		const oneDay = 24 * 60 * 60 * 1000;
		const deadline = this.#group?.schedule[this.#weekId]?.dateEnd + oneDay;
		const deadlineOverdue = Date.now() > deadline || false;
		return deadlineOverdue;
	}
	get accessGranted() {
		let result = false;
		if (this.#group) {
			const nextWeek = Number(this.#profile?.nextWeek?.id?.split('-')[1]);
			if (nextWeek === this.#lesson.lessonNumber) {
				result = true;
			} else {
				const weekStart = Object.values(this.#group.schedule).find(
					(item) =>
						item.weekNumber === this.#lesson.lessonNumber
				)?.dateStart;
				const now = Date.now();
				now >= weekStart ? (result = true) : (result = false);
			}
		}
		if (this.#student.blockedWeek && this.#student.blockedWeek < this.#lesson.lessonNumber) {
			result = false;
		}
		return result;
	}
	get tasks() {
		return this.#lesson.tasks;
	}
	get taskId() {
		for (let task of this.tasks) {
			if (task.type === 'theme') {
				return task.id;
			}
		}
	}
	get testId() {
		for (let task of this.tasks) {
			if (task.type === 'test') {
				return task.id;
			}
		}
	}
	get feedbackSent() {
		let feedbackSent = false;
		if (this.#feedbackStore?.feedback) {
			const feedbackTheme =
				this.getFeedbackByType(this.#feedbackStore.feedback, 'theme') || [];

			feedbackSent = this.checkSent(feedbackTheme, this.taskId) || false;
		}
		return feedbackSent;
	}

	/**
	 * @param feedbackInfo
	 * @param type
	 * @returns {Array<Object>}
	 */
	getFeedbackByType(feedbackInfo, type) {
		const feedback = feedbackInfo?.filter(
			(feedback) => feedback?.type === type
		)[0];
		delete feedback?.type;
		if (feedback) {
			return Object.values(feedback);
		}
	}

	/**
	 * @param feedbackInfo
	 * @param currentId
	 * @returns {boolean}
	 */
	checkSent(feedbackInfo, currentId) {
		for (let feed of feedbackInfo) {
			if (feed.id === currentId) {
				return true;
			}
		}
	}

	/**
	 * @param setTitleTask
	 * @param setIsTheme
	 * @returns {Promise<Array<Object>>}
	 */
	// async getTasksRecordsMaps(setTitleTask, setIsTheme) {
	// 	let tasksRecordMaps = [];
	// 	for (let task of this.tasks) {
	// 		if (!task.id) {
	// 			return;
	// 		}
	// 		if (task.type === 'theme') {
	// 			setTitleTask(task.title);
	// 			setIsTheme(true);
	// 		}
	//
	// 		if (task.type !== 'test') {
	// 			tasksRecordMaps.push({
	// 				path: `/lessons/${this.#profile.course}/${this.#weekId}/${task.type}.html`,
	// 				id: task.id,
	// 				type: task.type,
	// 				name: task.title,
	// 			});
	// 		}
	// 	}
	// 	return tasksRecordMaps;
	// }

	async getTasksRecordsMaps(setTitleTask, setIsTheme) { // старый вариант с использованием ноушен
		let tasksRecordMaps = [];
		for (let task of this.tasks) {
			if (!this.taskId) {
				return;
			}
			if (task.type === 'theme') {
				setTitleTask(task.title);
				setIsTheme(true);
			}
			if (task.type !== 'test') {
				await import(
					/* webpackInclude: /\.json$/ */
					`/app/modules/notion/${this.#profile.course}/pages/${task.id}.json`
					).then((module) => {
					tasksRecordMaps.push({
						...module.default,
						id: task.id,
						type: task.type,
						name: task.title,
					});
				});
			}
		}
		return tasksRecordMaps;
	}

	// getNotionLink() {
	// 	Array.from(document.querySelectorAll('a.notion-page-link')).map(
	// 		(npElem) => {
	// 			const npLinkDefault = npElem.href;
	// 			const npLinkLastPart = npLinkDefault.split('/').pop();
	// 			const npLink = 'https://itgirlschool.notion.site/' + npLinkLastPart;
	// 			npElem.href = npLink;
	// 			npElem.onclick = function (e) {
	// 				e.preventDefault();
	// 				window.open(npElem.href, '_blank');
	// 			};
	// 		}
	// 	);
	// }
}
