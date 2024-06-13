import { makeAutoObservable } from "mobx";
import Enum from "../../enum";

export default class GroupItemModel {

	/** @private {UsersStore} */
	#usersStore;

	#group;

	constructor(usersStore, group) {
		this.#usersStore = usersStore;
		this.#group = group;
		makeAutoObservable(this);
	}

	get students() {
		const studentListUid = Object.keys(this.#group.students);
		const filteredUsers = this.#usersStore.users.filter((user) =>
			studentListUid.includes(user.uid)
		);
		return filteredUsers;
	}

	get unseenStudents() {
		return Object.values(this.#group.studentsList).filter(
			(student) => student.unseenChats)
	}

	get avatarCount() {
		return Enum.avatarCount - this.students.length;
	}

	get weekNumber() {
		return this.#group.week?.weekNumber;
	}

	// get dayDifference() {
	// 	let today = new Date();
	// 	let separatedDate = this.#group.endDate.split('.');
	// 	let graduateDate = new Date(separatedDate.reverse().join('-'));
	// 	let dayDifference = Math.floor(
	// 		(today - graduateDate) / (1000 * 60 * 60 * 24)
	// 	);
	// 	return dayDifference;
	// }

	removePausedWeek(pausedWeek) {
		const now = Date.now();
		const studyStartWeek = Object.values(this.#group?.schedule).find(
			(week) => week.weekNumber === pausedWeek
		);
		if (studyStartWeek.dateEnd <= now) {
			this.#group.removePausedLesson(this.#group.id)
		}
	}
}
