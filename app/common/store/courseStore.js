// import { defineProperty, makeAutoObservable } from "mobx";
// import { database } from "../../modules/firebase";
//
// export default class CourseStore {
// 	id = null;
//
// 	lessons = [];
//
// 	tests = [];
//
// 	blocks = [];
//
// 	studentAchievement = [];
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	/** Создание курса с предзаполненными данными */
// 	static createCourse(data, { isLoaded = false } = {}) {
// 		const store = new CourseStore();
// 		store.setData(data);
// 		store.setLoaded(isLoaded);
//
// 		return store;
// 	}
//
// 	setLoaded(value) {
// 		this.isLoaded = value;
// 	}
//
// 	/** Загрузка данных курса */
//
// 	setData(data) {
// 		this.id = data.id;
// 		this.blocks = data.blocks || [];
// 		this.lessons = data.lessons || [];
// 		this.tests = data.tests || [];
// 		this.blocks = data.blocks || [];
// 		this.studentAchievement = data.studentAchievement || [];
// 	}
//
// 	loadData = async () => {
// 		if (this.isLoaded) {
// 			return;
// 		}
//
// 		if (!this.id) {
// 			return;
// 		}
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `courses/${this.id}`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		res.id = this.id;
//
// 		this.setData(res);
// 		this.setLoaded(true);
// 	};
//
// 	/** Курс */
//
// 	getStudentCourse = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}`);
// 		const data = await database.get(ref);
// 		const courseInfo = data.toJSON();
// 		if (!courseInfo) {
// 			return;
// 		}
// 		return courseInfo;
// 	};
//
// 	addCourse = async (id, course) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `courses/${id}`);
// 		await database.set(ref, course);
// 	}
//
// 	/** Тесты */
//
// 	addTest = async (test, lesson) => {
// 		const db = database.getDatabase();
// 		const testsRef = database.ref(db, `courses/${this.id}/tests`);
// 		const childRef = database.child(testsRef, test.id);
// 		await database.set(childRef, { ...test, lesson: lesson.title, block: lesson.block });
//
// 		const tasks = lesson.tasks ? Object.values(lesson.tasks) : [];
// 		tasks.push({
// 			id: test.id,
// 			type: "test",
// 			title: `Тест ${lesson.lessonNumber}`,
// 		});
// 		const lessonsRef = database.ref(db, `courses/${this.id}/lessons/${lesson.id}/tasks`);
// 		await database.set(lessonsRef, tasks);
// 	}
//
// 	updateTest = async (test) => {
// 		const db = database.getDatabase();
// 		const testsRef = database.ref(db, `courses/${this.id}/tests`);
// 		const childRef = database.child(testsRef, test.id);
// 		await database.update(childRef, test);
// 	}
//
// 	deleteTest = async (testId, lesson) => {
// 		const db = database.getDatabase();
// 		const testsRef = database.ref(db, `courses/${this.id}/tests`);
// 		const childRef = database.child(testsRef, testId);
// 		await database.remove(childRef);
//
// 		const tasks = Object.values(lesson.tasks);
// 		const index = tasks.findIndex((task) => task.id === testId);
// 		tasks.splice(index, 1);
// 		const lessonsRef = database.ref(db, `courses/${this.id}/lessons/${lesson.id}/tasks`);
// 		await database.set(lessonsRef, tasks);
// 	}
//
// 	getTests = async () => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `courses/${this.id}/tests`);
// 		const data = await database.get(ref);
// 		const tests = data.toJSON();
// 		if (!tests) {
// 			return [];
// 		}
// 		return Object.values(tests);
// 	}
// }
