import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid';

export default class MentorFormModel {

    /** @private {oneMentorStore} */
    #oneMentorStore;

    /** @private {coursesStore} */
    #coursesStore;

    constructor(oneMentorStore, coursesStore) {
        this.#oneMentorStore = oneMentorStore;
        this.#coursesStore = coursesStore;
        makeAutoObservable(this);
    }

    get courses() {
        return this.#coursesStore.courses;
    }

    formatCourses() {
        const courses = this.courses
            .filter((course) => course.id !== 'course-unassigned')
            .map((course) => course.id.split('-')[0])
        const uniqueCourses = new Set(courses);
        return [...uniqueCourses];
    }

    #getMentorIdIndex(mentors) {
        const mentorsIds = mentors.map((mentor) => mentor.id.split('-').pop());
        const lastMentorId = Math.max(...mentorsIds);
        return lastMentorId + 1;
    }

    #getErrorMessage(name, value) {
        if (!value) {
            return name === "experience" ?
                'Поле должно начинаться с заглавной буквы или цифры'
                : 'Поле должно начинаться с заглавной буквы';
        }
        switch (name) {
            case "companies":
                return 'Здесь можно добавить компании в которых ментор работал/работает (необязательное поле)'
            case "experience":
                return 'Здесь можно добавить опыт работы ментора (необязательное поле)'
            case "education":
                return 'Здесь можно добавить образование ментора (необязательное поле)'
            case "specialization":
                return 'Здесь можно добавить специальность ментора (необязательное поле)'
            default:
                break;
        }
    }

    validateInput(value, name) {
        if (
            value.length < 2 ||
            value.length > 30 ||
            !(value[0] === value[0].toUpperCase())
        ) {
            return this.#getErrorMessage(name, value);
        } else {
            return '';
        }
    }

    async submitMentorForm(mentorObj, mentors) {
        if (mentorObj.name && mentorObj.email && mentorObj.password && mentorObj.courses.length) {
            const uid = uuidv4();
            const mentorId = `${this.#getMentorIdIndex(mentors)}`;
            try {
                await this.#oneMentorStore.addMentor({
                    ...mentorObj,
                    id: mentorId,
                    uid: uid,
                });
                console.log(mentorObj, mentorId, uid);
            } catch (error) {
                console.log(error);
                return 'Failed to create mentor account';
            }
        } else {
            return 'Заполните все поля корректно';
        }
    }

}