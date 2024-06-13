import { makeAutoObservable } from "mobx";

export default class AdminFeedbackModel {

    /** @private {UsersStore} */
    #usersStore;

    /** @private {MentorsStore} */
    #mentorsStore;

    /** @private {CoursesStore} */
    #coursesStore;

    constructor(usersStore, mentorsStore, coursesStore) {
        this.#usersStore = usersStore;
        this.#mentorsStore = mentorsStore;
        this.#coursesStore = coursesStore;

        makeAutoObservable(this)
    }

    get users() {
        return this.#usersStore.users
    }

    get mentors() {
        return this.#mentorsStore.mentors
    }

    get courses() {
        return this.#coursesStore.courses
    }

    get usersData() {
        return this.users.map((user) => {
            return ({
                id: user.uid,
                text: `${user.name} (${user.group})`,
            });
        });
    }

    get mentorsData() {
        return this.mentors.map((mentor) => {
            return ({
                name: mentor.name,
                id: mentor.uid,
                groups: Object.keys(mentor.groups),
                text: `${mentor.name} (${Object.keys(mentor.groups).join(', ')})`,
            });
        });
    }

    get coursesData() {
        return this.courses
            .filter((course) => course.id !== 'course-unassigned')
            .map((course) => { return ({ id: course.id, text: course.id }) })
    };

    getSelectInfo(feedbackType) {
        let selectText = '';
        let selectOptions = null;

        switch (feedbackType) {
            case 'student':
                selectText = 'ученицу';
                selectOptions = this.usersData;
                break;
            case 'mentor':
                selectText = 'ментора';
                selectOptions = this.mentorsData;
                break;
            case 'lessons':
                selectText = 'курс';
                selectOptions = this.coursesData;
                break;
            case 'low':
                selectText = 'тип';
                selectOptions = [
                    { id: 'theme', name: 'Уроки', text: 'Уроки' },
                    { id: 'meeting', name: 'Учителя', text: 'Учителя' },
                ];
                break;
            default:
                break;
        }

        return {
            selectText,
            selectOptions,
        };
    }

    getMentorDataById(id) {
        return this.mentorsData.find((mentor) => mentor.id === id);
    }

    get feedbackInfo() {
        return this.users
            .filter((user) => user.feedback)
            .map((user) => {
                return ({
                    uid: user.uid,
                    name: user.name,
                    group: user.group,
                    feedback: user.feedback,
                });
            });
    }

    get currentCoursesThemes() {
        return this.courses
            .filter((course) => course.id !== 'course-unassigned')
            .map((course) => {
                const lessons = JSON.parse(
                    JSON.stringify(Object.values(course.lessons))
                );
                const themes = lessons
                    .map((lesson) => lesson.tasks && Object.values(lesson.tasks))
                    .flat()
                    .filter((task) => task && task.type === 'theme')
                    .map((theme) => {
                        return { name: theme.title, id: theme.id };
                    });
                return { course: course.id, themes };
            });
    }

    getCourseInfo(filterBy) {
        return this.currentCoursesThemes.find((item) => item.course === filterBy);
    }

    get currentMentors() {
        return this.mentors.map((mentor) => {
            return {
                name: mentor.name,
                uid: mentor.uid,
                feedback: [],
            };
        });
    }

    formatFeedbackData = (feedbackData) => {
        if (!feedbackData) {
            return [];
        }
        const feedbackInfo = JSON.parse(JSON.stringify(feedbackData.feedback));
        const formatedFeedback = Object.entries(feedbackInfo).map(
            ([key, values]) => {
                for (let key in values) {
                    values[key].id = key;
                }
                const feedback = Object.values(values);
                return { id: key, feedback };
            }
        );
        return formatedFeedback;
    }

    formatLowLessonFeedback = (feedbackData) => {
        const themeFormat = this.formatFeedbackData(feedbackData).find(
            (feedback) => feedback?.id === 'theme');
        return themeFormat?.feedback || [];
    }

    formatLowMentorFeedback = (feedbackData) => {
        if (feedbackData) {
            const feedback = JSON.parse(
                JSON.stringify(feedbackData.feedback)
            );
            if (feedbackData.meeting) {
                const meetingFeedback = Object.entries(
                    feedback.meeting
                ).map(([key, value]) => {
                    const mentor = value.mentor;
                    const feedback = Object.values(value)[0];
                    return { id: key, mentor, feedback };
                });
                return meetingFeedback;
            }
        }
        return [];
    }

    // FeedbackLow
    findLowFeedback(filterBy) {
        if (!this.feedbackInfo) {
            return;
        }
        const allFeedbackInfo = filterBy === 'meeting' ? [this.currentMentors] : [];
        this.feedbackInfo.forEach((feedback) => {
            const formatedFeedback =
                filterBy === 'meeting'
                    ? this.formatLowMentorFeedback(feedback)
                    : this.formatLowLessonFeedback(feedback);
            if (formatedFeedback) {
                const lowFormated = formatedFeedback.filter((item) => {
                    if (filterBy === 'meeting') {
                        return item.feedback.quality === 1;
                    }
                    if (filterBy === 'theme') {
                        return item.quality === 1;
                    }
                });
                allFeedbackInfo.push(lowFormated);
            }
        });
        const currentFeedback = this.#checkDuplicatedFeedback(filterBy, allFeedbackInfo);
        return currentFeedback;
    }

    #checkDuplicatedFeedback(filterBy, allFeedbackInfo) {
        const currentFeedback = allFeedbackInfo.flat();

        for (let i = 0; i < currentFeedback.length; i++) {
            const newFeedback = currentFeedback[i];
            const mentor = newFeedback.mentor || '';
            if (newFeedback) {
                const dublicate = currentFeedback.find((item) => {
                    if (filterBy === 'meeting' && mentor) {
                        return item.uid === mentor;
                    }
                    if (filterBy === 'theme') {
                        return (
                            item.id === newFeedback.id &&
                            item.comment !== newFeedback.comment
                        );
                    }
                });
                this.#handleDuplicateFeedback(filterBy, dublicate, newFeedback, allFeedbackInfo);
                dublicate &&
                    filterBy === 'theme' &&
                    currentFeedback.splice(i, 1);
            }
        }
        return filterBy === 'theme'
            ? currentFeedback
            : currentFeedback.filter((item) => item.name)

    }

    #handleDuplicateFeedback(filterBy, current, newFeedback, allFeedbackInfo) {
        if (filterBy === 'theme') {
            if (current) {
                const currentComents = [current.comment].flat();
                currentComents.push(newFeedback.comment);
                current.comment = currentComents;
            } else {
                allFeedbackInfo.push(newFeedback);
            }
        }
        if (filterBy === 'meeting') {
            if (current) {
                const allFeedback = current.feedback;
                const week = newFeedback.id;
                const feedback = newFeedback.feedback;
                if (allFeedback.length > 0) {
                    const weekDublicate = allFeedback.find((item) => {
                        return item.week === week;
                    });
                    if (weekDublicate) {
                        const currentFeedback = [weekDublicate.feedback].flat();
                        currentFeedback.push(feedback);
                        weekDublicate.feedback = currentFeedback;
                    } else {
                        allFeedback.push({ week, feedback });
                    }
                } else {
                    allFeedback.push({ week, feedback });
                }
            }
        }
    }

    // FeedbackLesson
    getCurrentThemes(courseInfo) {
        if (courseInfo) {
            const currentThemes = Object.values(courseInfo)[1]
                .map((theme) => {
                    return {
                        ...theme,
                        num: theme.id.split('-')[0],
                        quality: 0,
                        difficulty: 0,
                        amount: 0
                    };
                });
            return currentThemes.sort((a, b) => {
                return a.num - b.num;
            })
        }
    }

    getFeedbackByTheme(currentThemes, course) {
        const themesFeedback = this.feedbackInfo
            ?.filter((item) => {
                const user = this.#usersStore.getUser(item.uid);
                return user?.course === course;
            })
            ?.map((item) => {
                const formatedFeedback = this.formatFeedbackData(item);
                const themeFeedback = formatedFeedback.find(
                    (feedback) => feedback.id === 'theme'
                );
                return themeFeedback?.feedback;
            })
            .flat();

        themesFeedback?.forEach((theme) => {
            const lesson = currentThemes?.find((item) => item.id === theme?.id);
            if (lesson) {
                lesson.quality += theme.quality;
                lesson.difficulty += theme.difficulty;
                lesson.amount++;
            }
        });
    }

    calculateAverageLesson(sum, amount) {
        if (sum === 0) return 0;
        let average = (sum / amount).toFixed(2);
        return average;
    }

    // FeedbackMentors
    getMentorFeedbackDataById(id) {
        const mentorData = this.getMentorDataById(id)
        const currentGroups = mentorData?.groups;
        const allFeedback = this.feedbackInfo?.filter((stdFeedback) => {
            if (currentGroups?.includes(stdFeedback.group)) {
                const formatedFeedback = this.formatFeedbackData(stdFeedback);
                stdFeedback.feedback = formatedFeedback;
                return stdFeedback;
            }
        });
        return allFeedback;
    }

    #getAllMarks(feedback, type) {
        const allMarks = [];
        feedback?.flat().map((f) => {
            if (type === 'meeting') {
                Object.values(f).map((mark) => {
                    typeof mark === 'object' &&
                        allMarks.push(mark.quality || 0);
                });
            } else {
                allMarks.push(f.quality);
            }
        }) || 0;
        return allMarks.flat();
    }

    #calculateAverage(nums) {
        if (nums.length > 0) {
            let average = nums?.reduce((a, b) => a + b) / nums?.length;
            return +average.toFixed(2);
        }
        return 0;
    }

    getFeedbackAverage(allFeedback) {
        const allMeetingFeedbacks = [];
        const allHometaskFeedbacks = [];

        allFeedback.map((item) =>
            item.feedback.map((f) => {
                if (f.id === 'meeting') {
                    allMeetingFeedbacks.push(f.feedback);
                } else {
                    allHometaskFeedbacks.push(f.feedback);
                }
            })
        );

        const allMarksMeetingFeedbacks = this.#getAllMarks(allMeetingFeedbacks, 'meeting');
        const allMarksHometaskFeedbacks = this.#getAllMarks(allHometaskFeedbacks, 'hometask');
        const meetingsAverage = this.#calculateAverage(allMarksMeetingFeedbacks)
        const hometaskAverage = this.#calculateAverage(allMarksHometaskFeedbacks);

        return { meetingsAverage, hometaskAverage }
    }

    getMeetingsFeedbacks(feedback) {
        return feedback.filter((item) => {
            if (item.id === 'meeting') {
                return item;
            }
        });
    }

    // FeedbackStudent
    getStudentFeedbackDataById(studentId, feedbackType) {
        const studentFeedbackData = this.feedbackInfo?.find(
            (item) => item && item.uid === studentId
        );
        const formatedFeedback = this.formatFeedbackData(studentFeedbackData);
        const currentFeedback = formatedFeedback.find((item) => item.id === feedbackType)
            ?.feedback || [];
        return currentFeedback;
    }

    // FeedbackSchool
    get schoolFeedbackData() {
        let qualityAverage = 0;
        let recAverage = 0;
        let recCounter = 0;
        const allFeedback = [];
        const qualityMarks = [];

        this.feedbackInfo
            ?.filter((item) => item.feedback.school)
            .forEach((stdFeedback) => {
                const formatedFeedback = this.formatFeedbackData(stdFeedback);
                const schoolFeedback = formatedFeedback?.find(
                    (item) => item.id === 'school'
                );
                const feedback = schoolFeedback.feedback;
                feedback.forEach((item) => {
                    qualityMarks.push(item.quality);
                });
                if (feedback.slice(-1)[0].recommended === 'true') recCounter += 1;
                const name = stdFeedback.name;
                allFeedback.push({ name, feedback });
            });
        if (allFeedback) {
            qualityAverage = this.#calculateAverage(qualityMarks) || 0;
            recAverage = Math.round((recCounter / allFeedback.length) * 100);
        }
        return { allFeedback, qualityAverage, recAverage };
    }

}