import { formatDate } from "../../modules/format-date";

export default class GroupEditingModel {

	/** @private {MentorsStore}*/
	#mentorsStore;

	/** @private {GroupsStore}*/
	#groupsStore;

	/** @private {LessonsStore}*/
	#lessonsStore;

	#group;

	constructor(group, mentorsStore, groupsStore, lessonsStore) {
		this.#group = group;
		this.#mentorsStore = mentorsStore;
		this.#groupsStore = groupsStore;
		this.#lessonsStore = lessonsStore;
	}

	getMentorClassName = (item) => item.isHidden ? 'hidden-mentor' : 'group-mentor';

	handleSelectMentor(e, setDeletedMentor) {
		const chosenMentor = this.#mentorsStore.getMentor(e.target.value);
		setDeletedMentor(chosenMentor);
	}

	async deleteMentor(deletedMentor, setIsModalDeleteMentorVisible) {
		await this.#group.deleteMentor(deletedMentor.id, this.#group.id);
		this.#groupsStore.setLoaded(false);
		setIsModalDeleteMentorVisible(false);
	}

	async addMentor(selectMentor, isHidden) {
		if (Object.keys(selectMentor).length > 0) {
			await this.#group.addMentor(
				selectMentor.id,
				this.#group.id,
				selectMentor.name,
				this.#group.course,
				selectMentor.uid,
				isHidden
			);
			this.#groupsStore.setLoaded(false);
		}
	}

	getEndDateOfVacation(setDisabledVacations, setStudyStart) {
		const vacationEndWeek = this.#group?.week?.weekNumber + 1;
		// const vacationEndWeek = this.#group.lesson.lessonNumber + 1;
		const studyStartWeek = Object.values(this.#group.schedule).find(
			(week) => week.weekNumber === vacationEndWeek
		);
		if (!studyStartWeek) {
			setDisabledVacations(true);
		}
		if (this.#group.pausedWeek) {
			const date = studyStartWeek
				? new Date(studyStartWeek.dateStart)
				: null;
			if (date) {
				const dateFormatted = formatDate(date);
				setStudyStart(dateFormatted);
				// return new Date(studyStartWeek.dateStart);
			}
		}
	}

	async pauseGroup(pausedWeeksNum) {
		if (pausedWeeksNum !== '') {
			await this.#lessonsStore.updateSchedule(
				this.#group.id,
				this.#group.week.weekNumber,
				pausedWeeksNum,
				this.#group.week.dateStart
			);
		}
		this.#groupsStore.setLoaded(false);
	}

	async deletePausedWeek(setDeletePauseModal) {
		await this.#lessonsStore.deletePausedWeek(this.#group.id);
		this.#groupsStore.setLoaded(false);
		setDeletePauseModal(false);
	}

	// async pauseGroup(pausedWeeksNum) {
	// 	if (pausedWeeksNum !== '') {
	// 		await this.#lessonsStore.updateSchedule(
	// 			this.#group.id,
	// 			this.#group.week.weekNumber,
	// 			pausedWeeksNum,
	// 			this.#group.week.dateStart
	// 		);
	// 	}
	// 	this.#groupsStore.setLoaded(false);
	// }

	async getCourseBlocks(setBlockOfCourse) {
		if (this.#group.course) {
			const blocks = await this.#lessonsStore.getBlocks(this.#group.course);
			setBlockOfCourse(blocks);
		}
	}

	getGroupHolidays(blocks, setGroupHolidays) {
		const jobBlock = 'Трудоустройство'
		const lessonsCount = 0;
		setGroupHolidays(() =>
			blocks
				.filter((block, index) => index !== 0 && block !== jobBlock)
				.map((block) => [block, lessonsCount])
		);
	}

	onChangeHolidays(event, groupHolidays) {
		const block = event.target.name;
		const gap = +event.target.value;
		const upGroupHolidays = groupHolidays.map((holiday) =>
			holiday.includes(block) ? [block, gap] : holiday
		);
		return upGroupHolidays;
	}

	async editGroup(
		selectedCourse, startDate, groupHolidays, jobWeek, jobDuration,
		selectMentor, isHidden, endDate, handleDates, handleEditVisible,
	) {
		if (this.#group.startDate !== startDate ||
			this.#group.endDate !== endDate ||
			selectedCourse !== this.#group.course) {
			if (!Object.values(groupHolidays).length
				// || !jobWeek
			) {
				return 'Заполните каникулы и трудоустройство';
			}
			const groupVacationsInfo = Object.entries(groupHolidays).map(([block, duration]) => ([
				block,
				duration
			]));
			const schedule = await this.#lessonsStore.setGroupSchedule(
				selectedCourse,
				startDate,
				groupVacationsInfo,
				jobWeek,
				jobDuration
			)
			if (selectedCourse !== this.#group.course) {
				await this.#lessonsStore.setUpdatedSchedule(this.#group.id, schedule);
				await this.#group.updateCourse(selectedCourse);
				this.#group.setLoaded(false);
			}
			if (!selectedCourse ||
				!startDate) {
				return 'Вы заполнили не все поля';
			}
			await this.#group.updateGroupDates(this.#group.id, startDate, endDate, schedule);
			this.#group.setLoaded(false);
			handleDates(startDate, endDate);
		}
		this.addMentor(selectMentor, isHidden).catch(console.error);
		return '';
	}

	// async handleSelectedMentor(selectMentor, isHidden) {
	// 	if (selectMentor !== '') {
	// 		await this.#group.addMentor(
	// 			selectMentor.id,
	// 			this.#group.id,
	// 			selectMentor.name,
	// 			this.#group.course,
	// 			selectMentor.uid,
	// 			isHidden
	// 		);
	// 		this.#groupsStore.setLoaded(false);
	// 	}
	// };
	//
	// async editGroup(selectedCourse, schedule, startDate, handleDate) {
	// 	if (selectedCourse !== this.#group.course) {
	// 		await this.#group.setUpdatedSchedule(this.#group.id, schedule);
	// 		await this.#group.updateCourse(selectedCourse);
	// 	}
	// 	if (this.#group.startDate !== startDate) {
	// 		await this.#group.updateGroupDates(this.#group.id, startDate, schedule);
	// 		handleDate(startDate);
	// 	}
	// 	this.#group.setLoaded(false);
	// }

	// async editGroup(
	// 	selectedCourse, startDate, groupHolidays, selectMentor, isHidden,
	// 	jobWeek, jobDuration, endDate,
	// 	handleDates, handleEditVisible
	// ) {
	// 	const schedule = await this.#lessonsStore.setGroupSchedule(
	// 		selectedCourse,
	// 		startDate,
	// 		groupHolidays,
	// 		jobWeek,
	// 		jobDuration
	// 	)
	// 	if (selectedCourse !== this.#group.course) {
	// 		await this.#lessonsStore.setUpdatedSchedule(this.#group.id, schedule);
	// 		await this.#group.updateCourse(selectedCourse);
	// 		this.#group.setLoaded(false);
	// 	}
	// 	this.addMentor(selectMentor, isHidden).catch(console.error);
	// 	if (this.#group.startDate !== startDate || this.#group.endDate !== endDate) {
	// 		await this.#group.updateGroupDates(this.#group.id, startDate, endDate, schedule);
	// 		this.#group.setLoaded(false);
	// 		handleDates(startDate, endDate);
	// 	}
	// 	handleEditVisible(false);
	// }
}
