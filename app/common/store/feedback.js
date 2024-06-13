// import { makeAutoObservable, runInAction } from 'mobx';
// import { database } from '../../modules/firebase';
//
// export default class FeedbackStore {
// 	feedback = [];
// 	uid = null;
// 	isLoaded = false;
// 	statusLoaded = null;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	loadData = async (uid) => {
// 		this.uid = uid;
//
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/feedback`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
// 		if (!res) {
// 			return;
// 		}
//
// 		runInAction(() => {
// 			this.setFeedback(res);
// 			this.isLoaded = true;
// 		});
// 		return (res);
// 	};
//
// 	setFeedback = (feedback) => {
// 		if (!feedback) {
// 			feedback = [];
// 		}
// 		this.feedback = Object.entries(feedback).map(([key, value]) =>
// 			this.formatFeedback(key, value)
// 		);
// 	};
//
// 	setStatus = (status) => {
// 		if (!status) {
// 			return;
// 		}
// 		runInAction(() => {
// 			this.statusLoaded = status;
// 		});
// 	};
//
// 	formatFeedback = (feedbackKey, feedBackvalue) => {
// 		const formatedValue = Object.entries(feedBackvalue).map(
// 			([key, value]) => ({
// 				id: key,
// 				...value,
// 			})
// 		);
// 		return {
// 			type: feedbackKey,
// 			...formatedValue,
// 		};
// 	};
//
// 	getFeedbackbyType = (feedbackInfo, type) => {
// 		const feedback = feedbackInfo?.filter(
// 			(feedback) => feedback?.type === type
// 		)[0];
// 		delete feedback?.type;
// 		if (feedback) {
// 			const formatedFeedback = Object.values(feedback);
// 			return formatedFeedback;
// 		}
// 	};
//
// 	checkSent = (feedbackInfo, currentId, videoId) => {
// 		for (let feed of feedbackInfo) {
// 			if (feed.id === currentId) {
// 				if (videoId) {
// 					const videos = Object.keys(feed).find((id) => id === videoId)
// 					return true;
// 				} else {
// 					return true;
// 				}
// 			}
// 		}
// 	};
//
// 	sendFeedback = async (
// 		uid,
// 		id,
// 		feedbackType,
// 		text,
// 		quality,
// 		difficulty,
// 		title,
// 		mentorUid,
// 		videoId,
// 		recommended,
// 	) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`users/${uid}/feedback/${feedbackType}/${id}`
// 		);
// 		if (feedbackType !== 'meeting') {
// 			await database.update(ref, {
// 				quality: quality,
// 			});
// 			if (text !== '') {
// 				await database.update(ref, {
// 					comment: text,
// 				});
// 			}
// 		}
// 		if (feedbackType === 'hometask') {
// 			await database.update(ref, {
// 				title: title,
// 			});
//
// 		}
// 		if (feedbackType === 'theme') {
// 			await database.update(ref, {
// 				difficulty: difficulty,
// 				title: title,
// 			});
// 		}
// 		if (feedbackType === 'school') {
// 			await database.update(ref, {
// 				recommended: recommended
// 			});
// 			runInAction(() => {
// 				this.statusLoaded = 'inProgress';
// 			});
// 		}
// 		if (feedbackType === 'meeting') {
// 			const meetingRef = database.ref(
// 				db,
// 				`users/${uid}/feedback/${feedbackType}/${videoId}`
// 			);
// 			await database.update(meetingRef, {
// 				quality,
// 				title: title,
// 				mentor: mentorUid,
// 			});
// 			if (text !== '') {
// 				await database.update(meetingRef, {
// 					comment: text,
// 				});
// 			}
// 		}
// 	}
// }
