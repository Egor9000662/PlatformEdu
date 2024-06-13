export default class ProfilePage {
	/**@private {GroupStore}*/
	#group;
	/**@private {UserStore}*/
	#user;
	/**@private {ProgressStore}*/
	#progressStore;

	constructor(group, user, progressStore) {
		this.#group = group;
		this.#user = user;
		this.#progressStore = progressStore;
	}

	get durationOfStudy() {
		const lessons = Object.values(this.#group?.schedule).sort((a, b) => a.weekNumber - b.weekNumber);
		const lastLesson = lessons[lessons?.length - 1];
		return lastLesson?.weekNumber;
	}

	get currentLesson() {
		return this.#group?.week?.weekNumber === undefined ? 0 : this.#group?.week?.weekNumber;
	}

	get userName() {
		return this.#user?.displayName;
	}

	get isBestHomework() {
		return Boolean(this.#group?.bestHomework === this.#user.uid)
	}

	get today() {
		const year = new Date().getFullYear();
		const day = new Date().getDate();
		const month = new Date().getMonth() + 1;
		const today = `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month
			}.${year}`;
		return today;
	}

	get progressStudent() { //todo пока поставила заглушку, потом донные будем брать в бд
		return {
			"frontend": {
				"crystals": {
					"week-1": {
						"hardSkills": 1,
						"softSkills": 1
					},
					"week-2": {
						"hardSkills": 2,
						"softSkills": 1
					}
				},
			},
			"frontend-2": {
				"crystals": {
					"week-1": {
						"hardSkills": 3,
						"softSkills": 1
					},
					"week-2": {
						"hardSkills": 1,
						"softSkills": 1
					}
				},
			},
			"backend": {
				"crystals": {
					"week-1": {
						"hardSkills": 1,
						"softSkills": 1
					},
					"week-2": {
						"hardSkills": 1,
						"softSkills": 1
					}
				},
			},
		}
	}
	getCrystals(courseName) {
		const allCrystalsData = this.progressStudent[courseName].crystals;
		const crystals = {};
		if (allCrystalsData) {
			delete allCrystalsData.undefined;
			const allCrystals = Object.values(allCrystalsData);
			crystals['hardSkillsAmount'] = allCrystals
				.map((crystal) => {
					return crystal.hardSkills;
				})
				.filter((crystals) => crystals !== undefined)
				.reduce((a, b) => a + b, 0);
			crystals['softSkillsAmount'] = allCrystals
				.map((crystal) => {
					return crystal?.softSkills;
				})
				.filter((crystals) => crystals !== undefined)
				.reduce((a, b) => a + b, 0);
		}
		return crystals;
	}

	get crystals() {
		const allCrystalsData = this.#progressStore.progress?.crystals;
		const crystals = {};
		if (allCrystalsData) {
			delete allCrystalsData.undefined;
			const allCrystals = Object.values(allCrystalsData);
			crystals['hardSkillsAmount'] = allCrystals
				.map((crystal) => {
					return crystal.hardSkills;
				})
				.filter((crystals) => crystals !== undefined)
				.reduce((a, b) => a + b, 0);
			crystals['softSkillsAmount'] = allCrystals
				.map((crystal) => {
					return crystal?.softSkills;
				})
				.filter((crystals) => crystals !== undefined)
				.reduce((a, b) => a + b, 0);
		}
		return crystals;
	}

	get mentors() {
		const mentors = this.#group.mentor;
		const groupMentors = [];
		for (let key in mentors) {
			!mentors[key].isHidden && groupMentors.push(mentors[key]);
		}
		return groupMentors;
	}

	get lastFeedbackDate() {
		const feedbackInfo = this.#user?.feedback;
		if (feedbackInfo?.school) {
			const feedback = Object.entries(feedbackInfo.school).map(
				([key, value]) => {
					return { ...value, id: key };
				}
			);
			let formatFeedback;

			if (feedback) {
				formatFeedback = Object.values(feedback);
				return Number(formatFeedback[formatFeedback.length - 1].id);
			}
		}
	}
	showFeedbackModal(feedbackSentFlag) {
		const today = new Date().getTime();
		const thirtyDays = 30 * 24 * 60 * 60 * 1000;
		if (
			this.lastFeedbackDate === undefined ||
			(this.lastFeedbackDate + thirtyDays < today && !feedbackSentFlag)
		) {
			return true;
		} else {
			return false;
		}
	}
}
