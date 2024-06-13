import capitalizeFirstLetter from "../../common/template/capitalizeFirstLetter";
import { makeAutoObservable } from "mobx";

export default class MentorHomePage {

	/** @private {UsersStore} */
	#usersStore;

	/** @private {GroupsStore} */
	#groupsStore;

	mentor;

	constructor(oneMentor, usersStore, groupsStore) {
		this.mentor = oneMentor;
		this.#usersStore = usersStore;
		this.#groupsStore = groupsStore;
		makeAutoObservable(this)
	}

	/**
	 * @returns {unknown[]}
	 */
	get students() {
		const mentorGroups = Object.keys(this.mentor.groups);
		const mentorCourses = Object.values(this.mentor.groups).map((item) => item.course);
		return this.#usersStore.users
			.filter(
				(item) =>
					mentorGroups.some((group) => item.groups.some((item) => item.groupId === group &&
						mentorCourses.includes(item.course)))
			)
			.map((item) => item.uid);
	}

	getOverdueStudents(setIsOverdueModalVisible) {
		for (let student of this.students) {
			this.#usersStore.findOverdue(student).then((val) => {
				if (val === true) {
					setIsOverdueModalVisible(true);
				}
			});
		}
	}

	get uncheckedTasks() {
		const mentorGroups = Object.keys(this.mentor.groups);
		const mentorCourses = Object.values(this.mentor.groups).map((item) => item.course);
		return this.#usersStore.tasksUnchecked
			.flat()
			.filter(
				(item) =>
					mentorGroups.includes(item.group) &&
					mentorCourses.includes(item.course)
			);
	}

	get groups() {
		return this.#groupsStore.groups
			.filter((group) => group.mentor.hasOwnProperty(this.mentor.id))
			.sort((a, b) => a.archived ? 1 : b.archived ? -1 : 0);
	}

	/**
	 * @returns {unknown[]}
	 */
	getFilterOptions() {
		let hasArchivedGroups = false;
		let mentorCourseNames = [];
		const courses = this.mentor.courses;
		for (const course of courses) {
			for (const key in course) {
				if (key === 'id') {
					mentorCourseNames.push(course[key]);
				}
			}
		}
		for (const group of this.#groupsStore.groups) {
			if (group.mentor.hasOwnProperty(this.mentor.id)) {
				if (group.archived) {
					hasArchivedGroups = true;
				}
			}
		}
		const options = [];
		options.push({
			name: 'Вcе группы',
			value: undefined,
			isDefault: true,
		});
		for (const course of mentorCourseNames) {
			options.push({
				name: capitalizeFirstLetter(course),
				value: course,
			});
		}
		if (hasArchivedGroups) {
			options.push({ name: 'Архивированые', value: 'archived' });
		}
		return options;
	}

	/**
	 * @param {string} courseType
	 * @returns {unknown[]}
	 */
	filterGroups(courseType) {
		const mentorGroups = this.#groupsStore.groups.filter((group) =>
			group.mentor.hasOwnProperty(this.mentor.id)
		);
		if (courseType === 'archived') {
			return mentorGroups.filter((group) => group.archived);
		} else {
			const course = courseType;
			return mentorGroups.filter(
				(group) => group.course.includes(course) && !group.archived
			);
		}
	}
}
