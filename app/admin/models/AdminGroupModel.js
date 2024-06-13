import { makeAutoObservable } from "mobx";

export default class AdminGroupModel {

    /** @private {UsersStore} */
    #usersStore;

    /** @private {GroupsStore} */
    #groupsStore;

    /** @private {LessonsStore} */
    #lessonsStore;


    constructor(groupsStore, lessonsStore, usersStore) {
        this.#groupsStore = groupsStore;
        this.#lessonsStore = lessonsStore;
        this.#usersStore = usersStore;

        makeAutoObservable(this)
    }

    get users() {
        // return this.#usersStore.users.filter((user) => user.group !== 'group-unassigned')
        return this.#usersStore.users.filter((user) => !(Object.keys(user.groups).length === 1 && user.group === 'group-unassigned'))
    }

    get groups() {
        return this.#groupsStore.groups
    }

    getCurrentLesson(group) {
        const currentLessonId = group?.week?.id;
        return this.#lessonsStore.lessons.find(
            (lessonItem) => lessonItem.id === currentLessonId)
    }

    findUserByName(name) {
        return this.users.find(
            (item) => item?.name === name)
    }

    async addNewUserToGroup(student, groupId, course, startDate, handleAddStudentOk) {
        try {
            this.#usersStore.setLoaded(false);
            // const user = this.findUserByName(student);
            await student.updateUserGroup(student, groupId.id, course, startDate);
            this.#groupsStore.setLoaded(false);
            handleAddStudentOk();
            let select = document.getElementById('user');
            select.selectedIndex = 0;
            // history.push("/");
        } catch (err) {
            const error = 'Failed to update a user';
            console.log(err);
            console.log(error);
            return error;
        }
        this.#usersStore.setLoaded(false);
    }
}
