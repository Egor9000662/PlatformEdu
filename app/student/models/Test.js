export default class Test {
	/**@private {GroupsStore}*/
	#groupsStore;
	/**@private {ProgressStore}*/
	#progressStore;
	#weekId;
	#groupId

	constructor(groupsStore, weekId, groupId, progressStore) {
		this.#groupsStore = groupsStore;
		this.#weekId = weekId;
		this.#groupId = groupId;
		this.#progressStore = progressStore;
	}

	get deadlineOverdue() {
		const group = this.#groupsStore.getGroup(this.#groupId);
		const oneDay = 24 * 60 * 60 * 1000;
		const deadline = group?.schedule[this.#weekId]?.dateEnd + oneDay;
		const deadlineOverdue = Date.now() > deadline || false;
		return deadlineOverdue;
	}

	/**
	 * @param {string} id
	 * @returns {boolean}
	 */
	isFailed(id) {
		if(this.#progressStore?.progress?.test) {
			const result = this.#progressStore?.progress?.test[id]?.questions;
			if(result!==null && result!==undefined) {
				const failed = Boolean(Object.values(result)?.find((question) => question.mistakes >= 3));
				return failed;
			}
			}else {
				return false;
			}
		}

	/**
	 * @param {string} testId
	 * @param {function} setIsMistake
	 * @returns {any}
	 */
	getCount(testId, setIsMistake) {
		try {
			const questions = this.getQuestions(testId);
			let counter = 0;
			for (let question of Object.values(questions)) {
				if (question.userAnswer && question.mistakes < 3) {
					counter ++;
				}
				if (question.mistakes !== 0) {
					setIsMistake(true);
				}
			}
			return counter;
		}catch (e) {
			return 'ошибка'
		}
	};

	/**
	 * @param {string} testId
	 * @returns {[]|*|Object}
	 */
	getQuestions(testId) {
		if(this.#progressStore.progress !== undefined) {
			return this.#progressStore.progress?.test[testId]?.questions;
		}
	}

	/**
	 * @param {number} amount
	 * @param {number} correctAnswers
	 * @returns {boolean}
	 */
	getPassed(amount, correctAnswers) {
		let average = Math.round(amount / 2);
		return correctAnswers >= average;
	};

	/**
	 * @param {[]|*|Object} answers
	 * @param {string} testId
	 * @param {string} userId
	 * @param {string} questionId
	 * @returns {Promise<void>}
	 */
	async saveTestProgressToBD(answers, testId, userId, questionId) {
		const progressInfo = this.#progressStore.progress?.test?.[testId]?.isCrystal;
		const crystalsInfo = this.#progressStore.progress?.crystals?.[this.#weekId]?.hardSkills;
		const crystalsInfoObj = { weekId:this.#weekId, progressInfo, crystalsInfo };

		await this.#progressStore.updateTestProgress(
			userId,
			testId,
			questionId,
			answers,
			crystalsInfoObj,
			this.deadlineOverdue
		);
	}
}
