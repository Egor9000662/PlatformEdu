// /* eslint-disable no-mixed-spaces-and-tabs */
// import { makeAutoObservable, runInAction } from "mobx";
// import { database } from "../../modules/firebase";
//
// export default class ProgressStore {
// 	progress = null;
// 	comments = [];
// 	isLoaded = false;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	// Progress
//
// 	getProgress = async (userUid) => {
// 		/* if (this.progress) {
// 			return null;
// 		} */
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${userUid}`);
// 		const taskData = await database.get(ref);
//
// 		runInAction(() => {
// 			this.progress = taskData.toJSON();
// 			this.isLoaded = true;
// 		});
//
// 		return null;
// 	};
//
// 	getTaskProgress = async (userId, taskType, taskId) => {
// 		const db = database.getDatabase();
// 		let typeOfTask = taskType;
// 		if (taskType === "soft-skills") {
// 			typeOfTask = "practice";
// 		}
// 		const ref = database.ref(
// 			db,
// 			`progress/${userId}/${typeOfTask}/${taskId}`
// 		);
// 		const taskData = await database.get(ref);
// 		const task = taskData.toJSON();
// 		const deadlineOverdue = task?.deadlineOverdue || false;
// 		const extraTask = task?.isExtra || false;
// 		let crystal = false;
// 		if (task?.isCrystal === true) {
// 			crystal = true;
// 		} else {
// 			crystal = false;
// 		}
// 		const homeworkStatus = task?.homeworkStatus;
// 		return { crystal, deadlineOverdue, extraTask, homeworkStatus };
// 	};
//
// 	setTaskUnseen = async (uid, weekNum, taskId) => {
// 		if (!uid || !weekNum || !taskId) {
// 			return null;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/unseenChats`);
// 		const weekRef = database.child(ref, `week-${weekNum}`);
// 		const newChatUnseen = database.child(weekRef, taskId);
// 		await database.update(newChatUnseen, { isUnseen: true });
// 	};
//
// 	// Practice
//
// 	getTaskUnseenMessages = async (userId, taskId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${userId}/practice/${taskId}/comments`
// 		);
// 		const commentsData = await database.get(ref);
// 		const comments = commentsData.toJSON();
//
// 		if (!comments) {
// 			return 0;
// 		}
//
// 		return Object.values(comments).reduce((acc, item) => item.from === 'teacher' && item.seen === false ? acc + 1 : acc, 0);
// 	};
//
// 	sendPractice = async (practiceObj) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${practiceObj.uid}/practice/${practiceObj.taskId}`);
//
// 		const today = new Date(Date.now());
// 		const timeSent = new Date(today).setDate(today.getDate());
// 		const needToCheckAt = new Date(today).setDate(today.getDate() + 4);
//
// 		const comments = {
// 			timeSent,
// 			from: "student",
// 			seen: false,
// 			link: practiceObj.link,
// 			img: practiceObj.filesLinks,
// 			comment: practiceObj.message,
// 		}
// 		const data = {
// 			needToCheckAt: needToCheckAt,
// 			week: practiceObj.weekNumber,
// 			taskName: practiceObj.taskName,
// 			isUnseen: true,
// 			unseenMessages: 1,
// 			deadlineOverdue: practiceObj.deadlineOverdue,
// 			block: practiceObj.taskBlock,
// 		}
//
// 		function sendRequest(request) {
// 			return new Promise((resolve, reject) => {
// 				request
// 					.then(response => {
// 						resolve(response);
// 					})
// 					.catch(error => {
// 						reject(error);
// 					});
// 			});
// 		}
//
// 		return sendRequest(database.push(database.child(ref, "comments"), comments))
// 			.then(() => {
// 				sendRequest(database.update(ref, data))
// 			}).then(() => {
// 				sendRequest(this.setTaskUnseen(practiceObj.uid, practiceObj.weekNumber, practiceObj.taskId));
// 			}).then(() => {
// 				return sendRequest(database.get(ref))
// 			}).then(res => {
// 				const data = res.toJSON();
// 				if (!data || data.needToCheckAt !== needToCheckAt ||
// 					data.week !== practiceObj.weekNumber ||
// 					data.taskName !== practiceObj.taskName ||
// 					data.deadlineOverdue !== practiceObj.deadlineOverdue ||
// 					data.block !== practiceObj.taskBlock ||
// 					Object.values(data.comments)[0].timeSent !== timeSent ||
// 					Object.values(data.comments)[0].link !== practiceObj.link ||
// 					Object.values(data.comments)[0].comment !== practiceObj.message
// 				) {
// 					console.log("Error");
// 					sendRequest(database.remove(ref))
// 					return false;
// 				}
// 				return true;
// 			}).catch(error => {
// 				console.log(error);
// 				sendRequest(database.remove(ref))
// 				return false;
// 			})
// 	};
//
// 	// Tests
//
// 	updateTestProgress = async (
// 		userId,
// 		testId,
// 		questionId,
// 		answers,
// 		crystalsInfoObj,
// 		deadlineOverdue
// 	) => {
// 		const db = database.getDatabase();
// 		const testRef = database.ref(db, `progress/${userId}/test/${testId}`);
// 		const isPassed = answers.find((answer) => answer.mistakes >= 3) ? false : true;
// 		await database.update(testRef, {
// 			deadlineOverdue: deadlineOverdue,
// 			questions: answers,
// 			isCrystal: isPassed,
// 		});
// 		runInAction(() => {
// 			this.progress ??= {};
// 			this.progress.test ??= {}
// 			this.progress.test[testId] ??= {}
// 			this.progress.test[testId].questions = answers;
// 		})
//
// 		if (isPassed && !deadlineOverdue) {
// 			await this.changeCrystalTest(userId, crystalsInfoObj);
// 		}
// 	};
//
// 	clearQuestionsInfo = async (uid, taskId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${uid}/test/${taskId}/questions`
// 		);
// 		await database.remove(ref);
// 	};
//
// 	changeCrystalTest = async (userId, crystalsInfoObj) => {
// 		if (!crystalsInfoObj.progressInfo) {
// 			const crystalsNum = crystalsInfoObj.crystalsInfo > 0 ? crystalsInfoObj.crystalsInfo + 1 : 1;
// 			await this.updateCrystalsProgress(
// 				userId,
// 				crystalsInfoObj.weekId,
// 				crystalsNum
// 			);
// 		}
// 	};
//
// 	// Crystals
//
// 	updateCrystalsProgress = async (userId, lessonId, crystalsNum) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${userId}/crystals/${lessonId}`);
// 		await database.update(ref, { hardSkills: crystalsNum });
// 	};
//
// 	updateSoftSkillsCrystalsProgress = async (userId, weekId, crystalsNum) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${userId}/crystals/${weekId}`);
// 		await database.update(ref, { softSkills: crystalsNum });
// 	};
//
// 	getWeeklyCrystals = async (userId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${userId}/crystals`);
// 		const weeksCrystalsArrData = await database.get(ref);
// 		const weeksCrystals = weeksCrystalsArrData.toJSON();
// 		let crystalsData;
// 		if (weeksCrystals) {
// 			const weeksCrystalsArr = Object.entries(weeksCrystals).map(
// 				([key, value]) => ({
// 					week: key,
// 					...value,
// 				})
// 			);
// 			crystalsData = weeksCrystalsArr.map((weekObj) => {
// 				const hardSkillsAmount = weekObj.hardSkills || 0;
// 				const softSkillsAmount = weekObj.softSkills || 0;
//
// 				const total = hardSkillsAmount + softSkillsAmount;
//
// 				const id = weekObj.week;
// 				return { id, total };
// 			});
// 		}
// 		return crystalsData;
// 	};
//
// 	getWeeklyCrystalsAmount = async (userId, weekId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${userId}/crystals/${weekId}`);
// 		const crystalsData = await database.get(ref);
// 		const crystals = crystalsData.toJSON();
// 		return crystals || 0;
// 	}
//
// }
