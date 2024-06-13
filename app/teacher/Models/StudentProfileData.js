import {makeAutoObservable} from "mobx";

export default class StudentProfileData {

	/** @private {ProgressStore} */
	#progressStore;

	/** @private {UserStore} */
	student;

	constructor(student, progressStore) {
		this.student = student;
		this.#progressStore = progressStore;
		makeAutoObservable(this);
	}
	get group() {
		return this.student.group;
	}

	getStudentHomeworks() {
		const currentTasks = Object.entries(this.#progressStore.progress.practice).map(
			([key, value]) => ({
				taskId: key,
				uid: this.student.uid,
				course: this.student.course,
				...value,
			})
		);
		const studentHomeworks = this.#getValidHomeworks(currentTasks);
		this.#addStatusToOldHomeworks(studentHomeworks)
		return (Object.values(studentHomeworks))
			.sort((a, b) =>
				a.isUnseen ? -1 : b.isUnseen ? 1 : 0
				|| !a.homeworkStatus ? -1 : !b.homeworkStatus ? 1 : 0
				|| a.homeworkStatus === 're-review' ? -1 : b.homeworkStatus === 're-review' ? 1 : 0
				|| a.homeworkStatus === 'rework' ? -1 : b.homeworkStatus === 'rework' ? 1 : 0
			);

	}

	#getValidHomeworks(studentHomeworks) {
		const isValidPractice =[];
		for (let value of studentHomeworks) {
			if(value.comments && value.taskId) {
				isValidPractice.push(value);
			}
		}
		return isValidPractice;
	}

	#addStatusToOldHomeworks(homeworks) {
		for (const homework of homeworks) {
			if(homework.homeworkStatus === undefined) {
				const comments = Object.values(homework.comments)
				for (const comment of comments) {
					if (comment.markType === 'accepted') {
						homework.homeworkStatus = 'accepted';
						break;
					}
				}
			}
		}
	}

	getAllCrystals() {
		delete this.student?.crystals.undefined;
		const allCrystals = Object.values(this.student?.crystals);
		const hardSkillsAmount = allCrystals
			.map((crystal) => crystal.hardSkills)
			.filter((crystals) => crystals !== undefined)
			.reduce((a, b) => a + b, 0);
		const softSkillsAmount = allCrystals
			.map((crystal) => crystal.softSkills)
			.filter((crystals) => crystals !== undefined)
			.reduce((a, b) => a + b, 0);
		return hardSkillsAmount + softSkillsAmount || 0;
	}

	getUnseenMessagesCount(task) {
		if(!task.comments) {
			return 0;
		} else {
			const comments = Object.values(task.comments)
			const lastComments = comments[comments.length - 1];
			const isUnseenMessage =
				lastComments.from === 'student'
				&& lastComments.seen === false
				|| task?.homeworkStatus === 're-review'
			if (isUnseenMessage) {
				return 1;
			}
		}
	}
}
