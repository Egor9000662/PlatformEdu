import { makeAutoObservable } from "mobx";

export default class MentorHomeworksQueue {
	/** @private {HomeworksStore} */
	#homeworksStore;
	/** @private {MentorStore} */
	#mentor;
	/** @private {Boolean} */
	#isLoaded = false;

	constructor(homeworksStore, mentor, mentorsStore) {
		this.#homeworksStore = homeworksStore;
		this.mentorsStore = mentorsStore;
		this.#mentor = mentor;
		makeAutoObservable(this);
	}

	get isLoaded() {
		return this.#isLoaded;
	}

	set isLoaded(isLoaded) {
		return this.#isLoaded = isLoaded;
	}

	async loadData() {
		if (this.isLoaded) {
			return;
		}
		await Promise.all([
			this.#homeworksStore.loadData(),
			this.#mentor.loadData(),
		]);
		this.isLoaded = this.#homeworksStore.isLoaded && this.#mentor.isLoaded;
	}

	get length() {
		return Object.keys(this.#homeworks).length;
	}

	get blocks() {
		return Object.keys(this.#mentor.blocks);
	}

	set blocks(blocks) {
		return this.#mentor.updateMentorModules(this.#mentor.id, blocks);
	}

	get maxTasks() {
		return 1;
	}

	get canTakeHomework() {
		const takenHomeworks = Object.values(this.#mentor.homeworks).reduce((acc, task) => {
			if (task.status?.homeworkStatusLoaded() && !task.status.needsReworkByStudent()) {
				return acc + 1
			}
			return acc
		}, 0)
		return takenHomeworks < this.maxTasks;
	}

	get #homeworks() {
		const mentorBlocks = Object.keys(this.#mentor.blocks);
		return Object.entries(this.#homeworksStore.homeworks)
			.filter(([homeworkId, homework]) => mentorBlocks.includes(homework.block))
			.map(([homeworkId, homework]) => ({
				homeworkId,
				...homework,
				blockIsPriority: this.#mentor.blocks[homework.block].priority,
			}))
			.sort((a, b) => this.#inMentorGroups(b) - this.#inMentorGroups(a) ||
				this.#checkedThisStudentEarlier(b) - this.#checkedThisStudentEarlier(a) ||
				b.blockIsPriority - a.blockIsPriority);
	}

	#inMentorGroups(homework) {
		return this.#mentor.groups.hasOwnProperty(homework.group);
	};

	#checkedThisStudentEarlier(homework) {
		return (this.#mentor.mentorStudents || {})[homework.uid]?.numberOfHomeworkChecks;
	};

	takeHomework() {
		if (this.canTakeHomework) {
			const takenTask = this.#homeworks.shift();
			takenTask.timeTakenIn = new Date().getTime();
			this.#homeworksStore.deleteHomework(takenTask.homeworkId);
			this.#mentor.putHomeworkToMentor(this.#mentor.id, takenTask.homeworkId, takenTask);
			this.#homeworksStore.setLoadedHomeworks(false);
		}
	}

	deleteHomeworkFromMentor(homeworkId) {
		this.#mentor.deleteHomeworkFromMentor(this.#mentor.id, homeworkId);
	};
}
