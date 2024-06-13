// import { makeAutoObservable } from 'mobx';
// import { database } from '../../modules/firebase';
// import CourseStore from './courseStore';
//
// export default class CoursesStore {
// 	courses = [];
//
// 	isLoaded = false;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	loadDataCourse = async () => {
// 		if (this.isLoaded) {
// 			return;
// 		}
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, 'courses');
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		const courses = Object.entries(res).map(([key, value]) => CourseStore.createCourse({
// 			...value,
// 			id: key,
// 		}, { isLoaded: true }));
//
// 		this.setCourses(courses);
// 		this.setLoadedCourse(true);
// 	};
//
// 	setCourses(courses) {
// 		this.courses = courses;
// 	}
//
// 	setLoadedCourse(value) {
// 		this.isLoaded = value;
// 	}
//
// 	getCourseById = (id) => {
// 		return this.courses.find((course) => course.id === id);
// 	};
// }
