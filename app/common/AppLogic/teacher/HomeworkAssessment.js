import { makeAutoObservable } from "mobx";

export default class HomeworkAssessment {
	/** @private {HometaskChatStore} */
	#hometaskChatStore;

	/** @private {UsersStore} */
	#usersStore;

	/** @private {MentorStore}*/
	#oneMentorStore;

	/** @private {HomeworksStore}*/
	#homeworksStore;

	/** @private {MentorsStore}*/
	#mentorsStore;

	/** @private {ProgressStore} */
	#progressStore;

	get isLoaded() {
		return this.#homeworksStore.isLoaded && this.#mentorsStore.isLoaded;
	}

	constructor(
		hometaskChatStore,
		usersStore,
		oneMentorStore,
		homeworksStore,
		mentorsStore,
		progressStore
	) {
		this.#hometaskChatStore = hometaskChatStore;
		this.#usersStore = usersStore;
		this.#oneMentorStore = oneMentorStore;
		this.#homeworksStore = homeworksStore;
		this.#mentorsStore = mentorsStore;
		this.#progressStore = progressStore;
		makeAutoObservable(this);
	};

	async loadData() {
		await Promise.all([
			this.#homeworksStore.loadData(),
			this.#mentorsStore.loadData(),
		]);
	}

	async accept(currentMentor, homeworkObj, isExtraTask) {
		await this.#hometaskChatStore.markHomeworkAccepted(
			homeworkObj.theme,
			homeworkObj.weekNumber,
			isExtraTask,
			currentMentor.uid,
			homeworkObj.deadlineOverdue,
		);

		if (isExtraTask) {
			await this.#hometaskChatStore.addExtraTaskDone(homeworkObj.deadlineOverdue);
		}

		if (this.#getPracticeCheckDeadline(homeworkObj) && !homeworkObj.deadlineOverdue) {
			let crystalsNum = isExtraTask ? 2 : 1;
			const currentCrystals = await this.#getCrystalsAmount(homeworkObj);
			if (currentCrystals > 0) {
				crystalsNum = currentCrystals + (isExtraTask ? 2 : 1);
			}
			await this.#progressStore.updateCrystalsProgress(
				homeworkObj.uid,
				`week-${homeworkObj.weekNumber}`,
				crystalsNum
			);
		}

		if (homeworkObj.taskType !== 'soft-skills') {
			await this.#updateMentorCheckedHomework(currentMentor, homeworkObj);
		}

		const homeworksFromQueue = this.#getHomeworksFromQueue(homeworkObj);
		const mentorHomework = this.#getMentorHomework(homeworkObj);
		if (mentorHomework?.homeworkId) {
			await this.#oneMentorStore.deleteHomeworkFromMentor(
				currentMentor.id,
				mentorHomework.homeworkId
			);
		}
		if (homeworksFromQueue?.homeworkId) {
			await this.#homeworksStore.deleteHomework(homeworksFromQueue.homeworkId);
		}

		if (homeworkObj.isUnchecked) {
			await this.#usersStore.closeUncheckedStudent(homeworkObj.uid);
		}
		this.#homeworksStore.setLoadedHomeworks(false);
		await currentMentor.addStudentToMentorList(currentMentor, homeworkObj)
	};

	async #updateMentorCheckedHomework(currentMentorInfo, homeworkObj) {
		const checkedAmount = await this.#mentorsStore.getCheckedAmount(
			currentMentorInfo.id,
			homeworkObj.block
		);
		const amount = checkedAmount + 1;
		await currentMentorInfo.updateCheckedAmount(amount, homeworkObj.block);
	}

	#getMentorHomework(homeworkObj) {
		let homework;
		if (Object.keys(this.#oneMentorStore.homeworks).length !== 0) {
			homework = Object.values(this.#oneMentorStore.homeworks).find(
				(item) => item.uid === homeworkObj.uid && item.taskId === homeworkObj.taskId);
		}
		return homework;
	};

	#getHomeworksFromQueue(homeworkObj) {
		let homeworksFromQueue;
		const homeworks = this.#homeworksStore.homeworks;
		if (homeworks !== null && homeworks !== undefined) {
			homeworksFromQueue = Object.values(homeworks).find(
				(item) => item.uid === homeworkObj.uid && item.taskId === homeworkObj.taskId);
		}
		return homeworksFromQueue;
	};

	async #getCrystalsAmount(homeworkObj) {
		let crystalsAmount = 0;
		const crystals = await this.#hometaskChatStore.getStdWeeklyCrystals(
			homeworkObj.uid,
			`week-${homeworkObj.weekNumber}`
		);

		if (homeworkObj.taskType === 'practice') {
			crystalsAmount = crystals?.hardSkills || 0;
		} else {
			crystalsAmount = crystals?.softSkills || 0;
		}
		return crystalsAmount;
	};

	#getPracticeCheckDeadline(homeworkObj) {
		return this.#hometaskChatStore.practiceProgress?.[homeworkObj.taskId]?.needToCheckAt;
	};

	async decline(remarkValue, homeworkObj, currentMentor) {
		await this.#hometaskChatStore.submitHomeworkForRework(
			remarkValue,
			homeworkObj.theme,
			homeworkObj.weekNumber,
			currentMentor.uid
		)
		if (homeworkObj.isUnchecked) {
			await this.#usersStore.closeUncheckedStudent(homeworkObj.uid);
		}
	};
}
