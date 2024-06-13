// import { makeAutoObservable } from 'mobx';
// import { database } from '../../modules/firebase';
//
// export default class LessonStore {
// 	id = null;
//
// 	block = '';
//
// 	description = '';
//
// 	tasks = [];
//
// 	title = '';
//
// 	lessonNumber = undefined;
//
// 	accessInterval = undefined;
//
// 	content = undefined;
//
// 	isLoaded = false;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
//     // На будущее
// 	// async getLessonData(course){
// 	// 	const db = database.getDatabase();
// 	// 	const ref = database.ref(db, `courses/${course}/lessons/${this.id}/lessonData`);
// 	// 	const lessonData = await database.get(ref);
// 	// 	return lessonData;
// 	// }
//
// 	static createLesson(data, { isLoaded = false } = {}) {
// 		const store = new LessonStore();
// 		store.setData(data);
// 		store.setLoaded(isLoaded);
//
// 		return store;
// 	}
//
// 	loadData = async (course) => {
// 		if (this.isLoaded || !this.id || !course) {
// 			return;
// 		}
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `courses/${course}/lessons/${this.id}`);
// 		const data = await database.get(ref);
// 		const lesson = data.toJSON();
// 		lesson.id = this.id;
//
// 		this.setData(lesson);
// 		this.setLoaded(true);
// 	}
//
// 	setData(data) {
// 		this.id = data.id;
// 		this.block = data.block || '';
// 		this.description = data.description || '';
// 		this.title = data.title || '';
// 		this.lessonNumber = data.lessonNumber || data.weekNumber ; //todo
// 		this.tasks = data.tasks || {};
// 		this.tasks = Object.entries(this.tasks).map(([key, value]) => ({
// 			id: key,
// 			...value,
// 		}));
// 		this.accessInterval = data.accessInterval || 7;
// 		this.content = data.content || [];
// 	}
//
// 	setLoaded(value) {
// 		this.isLoaded = value;
// 	}
// }
