// import { makeAutoObservable, runInAction } from "mobx";
// import { database } from "../../modules/firebase/index";
// import MentorStore from "../store/mentor";
//
// export default class MentorsStore {
// 	mentors = [];
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
// 		const ref = database.ref(db, "mentors");
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		const mentors = Object.entries(res).map(([key, value]) =>
// 			MentorStore.createMentor(
// 				{
// 					...value,
// 					id: key,
// 				},
// 				{ isLoaded: true }
// 			)
// 		);
// 		runInAction(() => {
// 			this.setMentors(mentors);
// 			this.setLoaded(true);
// 		})
// 	};
//
//
// 	getMentor = (uid) => {
// 		let mentor = null;
//
// 		mentor = this.mentors.find((item) => item.uid === uid);
// 		if (!mentor) {
// 			mentor = MentorStore.createMentor({ uid }, { isLoaded: false });
// 			this.mentors.push(mentor);
// 		}
//
// 		return mentor;
// 	};
//
// 	getMentorsByGroupId = async (groupId) => {
// 		const db = database.getDatabase();
// 		const ref = database.query(
// 			database.ref(db, `groups/${groupId}/mentor`),
// 		);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		return res;
// 	};
//
// 	setMentors(mentors) {
// 		this.mentors = mentors;
// 	}
//
// 	setLoaded = (value) => {
// 		this.isLoaded = value;
// 	}
//
// 	isMentor = (uid) => {
// 		return this.mentors.some((item) => item.uid === uid);
// 	}
//
// 	resetCheckedAmountByMonth = async () => {
// 		const db = database.getDatabase();
// 		let reload = false;
// 		for (const mentor of this.mentors) {
// 			const month = mentor.getCurrentMonth();
// 			const ref = database.ref(db, `mentors/${mentor.id}/checkedTasks`);
// 			const data = await database.get(ref);
// 			const res = data.toJSON();
// 			if (res) {
// 				if (!Object.keys(res).includes(month.toString())) {
// 					await database.set(ref, { [month]: res });
// 					reload = true;
// 					mentor.setLoaded(false);
// 				}
// 			}
// 		}
//
// 		if (reload) {
// 			this.setLoaded(false);
// 		}
// 	}
// }
