import { makeAutoObservable } from "mobx";

export default class UrgentNoticeSender {

	/** @private {GroupsStore} */
	#groupsStore;

	/** @private {UserStore}*/
	#oneUserStore;

	get isLoaded() {
		return this.#groupsStore.isLoaded
	}

	constructor(groupsStore, oneUserStore) {
		this.#groupsStore = groupsStore;
		this.#oneUserStore = oneUserStore;
		makeAutoObservable(this)
	}

	async loadData() {
		await this.#groupsStore.loadData();
		this.#groupsStore.groups.forEach((group) => group.getStudents())
	};

	getCourseGroups(courses) {
		let groups = []
		for (let course of courses) {
			for (let group of this.#groupsStore.groups) {
				if (group.course === course) {
					groups.push(group.id)
				}
			}
		}
		return groups
	}

	send(notifsData, role) {
		notifsData.recipients.forEach((recipient) => {
			const students = this.#groupsStore.groups.find(
				(group) => group.id === recipient
			).studentsList;
			Object.values(students).forEach((student) =>
				this.#oneUserStore.sendUrgentNotice(
					student.uid,
					role,
					notifsData,
				)
			);
		});
	}

	getNotifsThemes(role) {
		const notifsThemes = [
			{
				name: 'Перенос занятия',
				roles: ['admin', 'teacher'],
			},
			{
				name: 'Отмена занятия',
				roles: ['admin', 'teacher'],
			},
			{
				name: 'Оплата занятий',
				roles: ['admin'],
			},
			{
				name: 'Общая информация',
				roles: ['admin'],
			},
		];
		return notifsThemes
			.filter((theme) =>
				theme.roles.find(
					(item) => item === role
				)
			)
	}

	validateNotifsData(notifsData) {
		let errors = [];
		if (!notifsData?.recipients?.length) {
			errors.push('получатели');
		}
		if (notifsData?.event === '') {
			errors.push('событие');
		}
		if (notifsData?.message === '') {
			errors.push('сообщение');
		}
		return errors;
	}
}
