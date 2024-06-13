import { makeAutoObservable } from "mobx";

export default class AddingHomeworkToQueue {
	/** @private {HometaskChatStore} */
	#hometaskChatStore;

	/** @private {ProgressStore} */
	#progressStore;

	/** @private {HomeworksStore}*/
	#homeworksStore;

	constructor(hometaskChatStore, progressStore, homeworksStore) {
		this.#hometaskChatStore = hometaskChatStore;
		this.#progressStore = progressStore;
		this.#homeworksStore = homeworksStore;
		makeAutoObservable(this);
	}

	async send(homeworkObj, practiceObj, student, taskType) {
		if (taskType === 'practice' && homeworkObj.block !== 'Трудоустройство') {
			// await this.#homeworksStore.sendHomeworkForCheck(homeworkObj);
			const res = await this.#progressStore.sendPractice(practiceObj);
			if (res) {
				if (homeworkObj.weekNumber === 1 && !student.achievement.shockMode) {
					await student.addNewAchievementBlock(homeworkObj.uid, "shockMode", homeworkObj.weekNumber);
				} else if (homeworkObj.weekNumber !== 1 && !student.achievement.shockMode) {
					await student.addNewAchievementBlock(homeworkObj.uid, "shockMode", homeworkObj.weekNumber);
				} else {
					await student.updateStudentAchievement(homeworkObj.uid, "shockMode");
				}
			}
			return res;
		}
		if (taskType === 'soft-skills') {
			await this.#addCrystal(homeworkObj);
			return true;
		}
	}

	async returnToQueue(homeworkObj) {
		await this.#homeworksStore.sendHomeworkForCheck(homeworkObj);
	}

	async #addCrystal(homeworkObj) {
		const crystals = await this.#hometaskChatStore.getStdWeeklyCrystals(
			homeworkObj.uid,
			`week-${homeworkObj.weekNumber}`
		);
		const crystalsAmount = crystals?.softSkills || 0;
		const amount = crystalsAmount + 1;
		await this.#progressStore.updateSoftSkillsCrystalsProgress(
			homeworkObj.uid,
			`week-${homeworkObj.weekNumber}`,
			amount
		);
	}

	isValidHomeworkParameters(homeworkObj) {
		const parameters = Object.values(homeworkObj);
		const errors = [];
		for (const parameter of parameters) {
			if (parameter === undefined || parameter === null || parameter === '') {
				errors.push(parameter);
			}
		}
		if (errors.length) {
			return false;
		} else {
			return true;
		}
	}
}
