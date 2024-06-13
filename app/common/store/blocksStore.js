// import {makeAutoObservable, runInAction} from "mobx";
// import {database} from '../../modules/firebase';
//
// export default class BlocksStore {
// 	frontendBlocks = [];
// 	allCoursesBlocks = undefined;
// 	isLoaded = false;
// 	blocks = undefined;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	loadAllCoursesBlocks = async () => {
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(db, `courses`);
// 		const data = await database.get(ref);
// 		const courses = data.toJSON();
// 		const allBlocks = [];
// 		for (const [courseId, course] of Object.entries(courses)) {
// 			if (!course.hasOwnProperty('blocks')) {
// 				continue;
// 			}
// 			for (let [blockId, block] of Object.entries(course.blocks)) {
// 				block = {courseId, id: blockId, ...block};
// 				allBlocks.push(block);
// 			}
// 		}
// 		runInAction(() => {
// 			this.allCoursesBlocks = allBlocks;
// 			this.setLoaded(true);
// 		})
// 	}
//
// 	loadCourseFrontendBlocks = async () => {
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(db, `courses/frontend-2/blocks`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		runInAction(() => {
// 			this.frontendBlocks = Object.values(res);
// 			this.setLoaded(true);
// 		})
// 	}
//
// 	updateCostOfValidationBlock = async (blockName, newCost) => {
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(db, `courses/frontend-2/blocks/${blockName}`);
// 		await database.update(ref, {homeworkCheckPrice: newCost});
//
// 		runInAction(() => {
// 			const block = this.frontendBlocks.find(item => item.id === blockName);
// 			block.homeworkCheckPrice = newCost;
// 		});
// 	}
//
// 	setLoaded = (value) => {
// 		this.isLoaded = value;
// 	}
//
// 	getCourseBlocks = async (course) => {
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(db, `courses/${course}/blocks`);
// 		const blocks = await database.get(ref);
// 		const res = blocks.toJSON();
// 		runInAction(() => {
// 			this.blocks = res;
// 		});
// 	}
// }
