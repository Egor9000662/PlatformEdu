import { makeAutoObservable } from "mobx";

export default class StudentList {
	/** @private {GroupsStore} */
	#groupsStore;

	/** @private {LessonsStore} */
	#lessonsStore;

	/** @private {ProgressStore} */
	#progressStore;

	group;

	constructor(group, groupsStore, lessonsStore, progressStore) {
		this.group = group;
		this.#groupsStore = groupsStore;
		this.#lessonsStore = lessonsStore;
		this.#progressStore = progressStore;
		makeAutoObservable(this);
	}

	get currentWeek() {
		return this.group.week?.weekNumber;
	}

	get schedule() {
		return this.group.schedule;
	}

	get bestStudents() {
		return this.group?.bestStudents;
	}

	/**
	 * @returns {Promise<Array>}
	 */
	async getStudentAllProgress() {
		const studentsIds = Object.keys(this.group.studentsList)
		const allProgress = [];
		for (const value of studentsIds) {
			const weeksCrystals = await this.#progressStore.getWeeklyCrystals(value);
			const openAccess = this.#getWeekProgress(value);
			if (weeksCrystals) {
				const studentObj = {
					uid: value,
					openAccess,
				};
				allProgress.push(studentObj);
			}
		}
		return allProgress;
	}

	/**
	 * @param {string} uid
	 * @returns {boolean}
	 */
	async #getWeekProgress(uid) {
		if (this.#lessonsStore.lessons.length) {
			let tasksDone = 0;
			const currentTasks =
				this.#lessonsStore.lessons
					.find((task) => task.id === `week-${this.group.week?.weekNumber}`)
					.tasks.filter(
						(task) =>
							task.type === 'practice' || task.type === 'test'
					) || [];

			await Promise.all(currentTasks.map(async (task) => {
				return await this.#progressStore.getTaskProgress(uid, task.type, task.id)
					.then((res) => res.crystal && tasksDone++);
			}));

			return tasksDone === Boolean(currentTasks.length);
		}
	};

	/**
	 * @param {string} searchName
	 * @returns {unknown[]}
	 */
	getMentorStudents(searchName) {
		return Object.values(this.group.studentsList)
			.filter((student) => {
				if (typeof student.group === 'object') {
					return Object.values(student.group).some((group) => group.course === this.group.course);
				}
				return student.course === this.group.course
			})
			.filter((student) => {
				if (searchName === '') {
					return student;
				}
				if (student.name.toLowerCase().includes(searchName.toLowerCase())) {
					return student;
				}
				return null;
			})
			.sort((a, b) => a.unseenChats ? -1 : b.unseenChats ? 1 : 0)
	};

}
