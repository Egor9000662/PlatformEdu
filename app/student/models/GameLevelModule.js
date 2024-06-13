export default class GameLevelModule {
	#lesson;
	/** @private {ProgressStore}*/
	#progressStore;

	constructor(lesson, progressStore) {
		this.#lesson = lesson;
		this.#progressStore = progressStore;
	}

	getTasksData = async (uid) => {
		const tasksData = [];
		for (let task of this.#lesson?.tasks) {
			const taskId = task?.id;
			const taskType = task?.type;
			if (taskType !== 'links' && taskType !== 'theme') {
				const taskObj = await this.#progressStore.getTaskProgress(uid, taskType, taskId)
				tasksData.push({ taskId, taskType, ...taskObj });
			}
		}
		return tasksData;
	}

	getProgressType(lessonId) {
		const currentLessonNum = this.#lesson?.id?.split('-')[1];
		if (Number(lessonId) > Number(currentLessonNum)) {
			return 'passed';
		} else if (Number(lessonId) === Number(currentLessonNum)) {
			return 'inProgress';
		} else {
			return '';
		}
	};
}
