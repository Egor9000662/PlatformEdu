import { makeAutoObservable } from "mobx";
import checkedEmail from '../pages/Home/checkedEmail';

export default class AdminHomePageModel {

    /** @private {UsersStore} */
    #usersStore;

    /** @private {GroupsStore} */
    #groupsStore;

    constructor(usersStore, groupsStore) {
        this.#usersStore = usersStore;
        this.#groupsStore = groupsStore;

        makeAutoObservable(this)
    }

    get groups() {
        return this.#groupsStore.groups
    }

    get studentsUnchecked() {
        return this.#usersStore.studentsUnchecked
    }

    get users() {
        return this.#usersStore.users
    }

    get findOverdue() {
        return this.#usersStore.findOverdue
    }

    get tasksUnchecked() {
        return JSON.parse(JSON.stringify(this.#usersStore.tasksUnchecked)).flat();
    }

    setDebtors() { //todo скорректировать метод для нескольких групп у юзера
        this.users.forEach(user => {
            const groupInfo = this.groups?.find((group) => group.id === user.group);
            user.addMonthInDebt(user.uid, user.group);
            user.setDebtorStatus(user.uid, user.group, groupInfo?.startDate);
        })
    }

    orderGroups(groupType) {
        return [...this.groups]
            .sort((a, b) => a.archived - b.archived)
            .filter((group) => groupType === 'course-unassigned'
                ? group.archived
                : group.course.includes(groupType));
    }

    hasOverdue() {
        return this.#usersStore.users.some((item) => this.findOverdue(item.uid)
        );
    }

    async checkGroupVacations(group) {
        const now = new Date();
        const currentWeek = group.week;
        const schedule = Object.values(group.schedule);
        const nextWeek = schedule.find((week) => week.weekNumber === +currentWeek?.weekNumber + 1);
        switch (true) {
            case !nextWeek:
                return;
            case now >= currentWeek.dateEnd && now <= nextWeek.dateStart:
                await group.setVacation(group.id, currentWeek.weekNumber);
                break;
            case group.pausedLesson:
                await group.removePausedWeek(group.id);
                break;
            default:
                break;
        }
    }

    async handleGroupsCheck() {
        let groupCheckInfo = [];
        for (let group of this.groups) {
            await group.loadData();
            await group.getStudents();
            await group.setPaymentDate(group.id);

            if (group.id !== 'group-unassigned') {
                const studentsData = JSON.parse(
                    JSON.stringify(group?.studentsList)
                );
                const studentsAmount = Object.keys(studentsData)?.length;
                const name = group.id;
                groupCheckInfo.push({ name, studentsAmount });
                await this.checkGroupVacations(group)
            }
        }
        for (let groupItem of groupCheckInfo) {
            if (this.studentsUnchecked.length > 0) { //todo 
                const currentGroupStds = this.studentsUnchecked.filter(
                    (student) => student.group === groupItem.name
                ).length;
                groupItem.currentUnchecked = currentGroupStds;
            }
        }
        if (groupCheckInfo.length > 0) {
            this.#sendAdminEmail(groupCheckInfo);
        }
    }

    #sendAdminEmail() {
        let emailSent = false;
        const now = new Date();
        const dateSent = localStorage.getItem('admin-sent');
        if (!dateSent) {
            localStorage.setItem('admin-sent', now);
            //функция отправки на почту скрыта, чтобы не тратить тарифные ограничения
            // checkedEmail(groupCheckInfo);
            emailSent = true;
        }
        if (dateSent) {
            const prevDate = new Date(dateSent);
            if (now.getDate() !== prevDate.getDate()) {
                localStorage.setItem('admin-sent', now);
                emailSent = false;
                if (emailSent === false) {
                    //функция отправки на почту скрыта, чтобы не тратить тарифные ограничения
                    // checkedEmail(groupCheckInfo);
                    emailSent = true;
                }
            }
        }
    }

    getStudentsFilteredByGroup(groupId) {
        // return this.users.filter((user) => user.group === groupId);
        return this.users.filter((user) => Object.keys(user.groups).includes(groupId));
    }

    getGroupById(groupId) {
        return this.groups.find((group) => group.id === groupId);
    }

    removePausedWeek(groupId) {
        const now = Date.now();
        const group = this.getGroupById(groupId)
        const studyStartWeek = Object.values(group?.schedule).find(
            (week) => week.weekNumber === group?.pausedLesson
        );
        if (studyStartWeek?.dateEnd <= now) {
            group.removePausedWeek(groupId);
        }
    }
}
