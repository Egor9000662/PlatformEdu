import { makeAutoObservable } from "mobx";

export default class GroupFormModel {

    /** @private {OneGroupStore} */
    #oneGroupStore;

    /** @private {LessonsStore} */
    #lessonsStore;

    constructor(oneGroupStore, lessonsStore) {
        this.#oneGroupStore = oneGroupStore;
        this.#lessonsStore = lessonsStore;
        makeAutoObservable(this);
    }

    async getCourseBlocks(courseName) {
        const blocks = await this.#lessonsStore.getBlocks(courseName);
        return blocks.filter((block, index) =>
            index !== 0 && block !== 'Трудоустройство')
    }

    async getSchedule(
        courseName,
        courseStartDate,
        groupVacations,
        employmentStartWeek,
        employmentDuration) {
        const groupVacationsInfo = Object.entries(groupVacations).map(([block, duration]) => ([
            block,
            duration
        ]
        ));
        const schedule = await this.#lessonsStore.setGroupSchedule(
            courseName,
            courseStartDate,
            groupVacationsInfo,
            employmentStartWeek,
            employmentDuration
        );
        return schedule;
    }

    async submitGroupForm({
        groupName,
        courseName,
        mentor,
        courseStartDate,
        courseEndDate,
        groupVacations,
        employmentStartWeek,
        employmentDuration,
        history }) {

        if (!groupName ||
            !mentor ||
            !courseStartDate ||
            !courseEndDate ||
            !Object.values(groupVacations).length ||
            !employmentStartWeek) {
            return 'Вы заполнили не все поля';
        }

        const schedule = await this.getSchedule(courseName,
            courseStartDate,
            groupVacations,
            employmentStartWeek,
            employmentDuration);

        try {
            await this.#oneGroupStore.addGroup({
                nameGroup: groupName,
                nameCourse: courseName,
                mentor: mentor.id,
                mentorUid: mentor.uid,
                mentorName: mentor.name,
                startDate: courseStartDate,
                endDate: courseEndDate,
                schedule: schedule,
            });
            this.#oneGroupStore.setLoaded(false);
            history.push('/');
            return '';
        } catch (err) {
            console.log(err);
            return 'Failed to create a group';
        }
    }

}