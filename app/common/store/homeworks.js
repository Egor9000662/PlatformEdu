// import { makeAutoObservable, runInAction } from 'mobx';
// import { database } from '../../modules/firebase';
// import {formatDateMonthYear} from "../../modules/format-date";
// export default class HomeworksStore {
// 	homeworks = {};
//
// 	isLoaded = false;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	loadData = async () => {
// 		if (this.isLoaded) {
// 			return;
// 		}
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `homeworks/`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON()||{};
//
// 		runInAction(() => {
// 			this.homeworks = res;
// 		});
// 		this.setLoadedHomeworks(true);
// 	};
//
// 	setLoadedHomeworks = (value) => {
// 		this.isLoaded = value;
// 	}
//
// 	deleteHomework = async (homeworkId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`homeworks/${homeworkId}`
// 		);
// 		await database.remove(ref);
//
// 		runInAction(() => {
// 			delete this.homeworks[homeworkId];
// 		});
// 	};
//
// 	sendHomeworkForCheck = async (homeworkObj) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `homeworks`);
// 		const homeworkRef = database.push(ref);
// 		await database.set(homeworkRef, homeworkObj);
//
// 		runInAction(() => {
// 			this.homeworks[homeworkRef.key] = homeworkObj;
// 		});
// 	};
// }
