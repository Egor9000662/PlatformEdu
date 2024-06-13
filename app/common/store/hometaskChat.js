// import { makeAutoObservable, runInAction } from 'mobx';
// import { database } from '../../modules/firebase';
//
// export default class HometaskChatStore {
// 	taskId = null;
// 	uid = null;
// 	lessonNum = null;
// 	practiceProgress = null;
// 	messages = [];
// 	messagesUnseen = 0;
// 	isUnseen = false;
// 	isLoaded = false;
// 	viewingDate = null;
// 	homeworkStatus = undefined;
// 	checkedBy = null;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	get #timeSent() {
// 		const currentDate = new Date(Date.now());
// 		return new Date(currentDate).setDate(currentDate.getDate());
// 	}
//
// 	loadData = (uid, taskId, lessonNum) => {
// 		this.uid = uid;
// 		this.taskId = taskId;
// 		this.lessonNum = lessonNum;
// 		this.loadMessages(uid, taskId);
// 		this.loadHomeworkStatus(uid, taskId);
// 	};
//
// 	loadMessages = async (uid, taskId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${uid}/practice/${taskId}/comments`
// 		);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		runInAction(() => {
// 			this.setMessages(res);
// 			this.isLoaded = true;
// 		});
// 	};
//
// 	loadHomeworkStatus = async (uid, taskId) => {
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(
// 			db,
// 			`progress/${uid}/practice/${taskId}`
// 		);
// 		const taskData = await database.get(ref);
// 		const task = taskData.toJSON();
// 		let status = task?.homeworkStatus === undefined ? null : task.homeworkStatus;
//
// 		runInAction(() => {
// 			this.homeworkStatus = status;
// 		});
// 	};
//
// 	setHomeworkStatus = async (status) => {
// 		const db = await database.getDatabase();
// 		const ref = await database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}`
// 		);
// 		await database.update(ref, {
// 			homeworkStatus: status,
// 		});
// 		runInAction(() => this.homeworkStatus = status);
// 	};
//
// 	setHomeworkMentor = async (mentorUid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}`
// 		);
// 		await database.update(ref, {
// 			checkedBy: mentorUid,
// 		});
// 		runInAction(() => this.checkedBy = mentorUid);
// 	}
//
// 	homeworkStatusLoaded = () => this.homeworkStatus !== undefined;
// 	hasBeenReviewed = () => !this.homeworkStatusLoaded() ? undefined : this.homeworkStatus !== null;
// 	needsReworkByStudent = () => !this.homeworkStatusLoaded() ? undefined : this.homeworkStatus === 'rework';
// 	needsReReviewByMentor = () => !this.homeworkStatusLoaded() ? undefined : this.homeworkStatus === 're-review';
//
// 	setMessages(msg) {
// 		if (!msg) {
// 			msg = {};
// 		}
//
// 		this.messages = Object.entries(msg).map(([key, value]) => ({
// 			commentId: key,
// 			...value,
// 		}));
// 	}
//
// 	getPracticeProgress = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${uid}/practice`);
// 		const practiceData = await database.get(ref);
// 		runInAction(() => {
// 			this.practiceProgress = practiceData.toJSON();
// 		});
//
// 		return null;
// 	};
//
// 	addMessage = async (message) => {
// 		if (this.messages.length === 0) {
// 			this.messagesUnseen = 0;
// 			this.isUnseen = false;
// 		}
// 		const messageObj = {
// 			timeSent: this.#timeSent,
// 			seen: false,
// 			from: message.from,
// 			img: message.img,
// 			link: message.link || false,
// 			comment: message.text,
// 		};
//
// 		if (message.from === 'student') {
// 			this.messagesUnseen++;
// 			this.isUnseen = true;
// 		}
//
// 		const isCorrectMessage = await this.sendPracticeMessage(messageObj);
// 		if (!isCorrectMessage) {
// 			return false;
// 		}
//
// 		this.setLoaded(false);
// 		this.changeUnseenStats();
// 		runInAction(() => {
// 			this.messages.push(messageObj);
// 		});
// 		return true;
// 	};
//
// 	sendPracticeMessage = async (message) => {
// 		if (!this.taskId) {
// 			return false;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}/comments`
// 		);
// 		const messagePlace = database.push(ref);
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
// 		return sendRequest(database.update(messagePlace, message))
// 			.then(() => {
// 				return sendRequest(database.get(messagePlace));
// 			})
// 			.then((res) => {
// 				if (!res) {
// 					return false;
// 				}
// 				const data = res.toJSON();
// 				if (data.timeSent === message.timeSent &&
// 					data.comment === message.comment &&
// 					data.from === message.from) {
// 					return true;
// 				}
//
// 				sendRequest(database.remove(messagePlace));
// 				return false;
// 			}).catch((err) => {
// 				sendRequest(database.remove(messagePlace));
// 				return false;
// 			})
// 	};
//
// 	changeUnseenStats = async () => {
// 		if (!this.taskId) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}`
// 		);
// 		await database.update(ref, {
// 			isUnseen: this.isUnseen,
// 			unseenMessages: this.messagesUnseen,
// 		});
// 		this.setViewingDate()
// 	};
//
// 	setViewingDate = async () => {
// 		const currentViewingDate = Date.now();
// 		const difference = this.viewingDate ? currentViewingDate - this.viewingDate : 0;
// 		if (!this.viewingDate || difference > 86400000) {
// 			const difference = this.viewingDate ? currentViewingDate - this.viewingDate : 0;
// 			if (!this.viewingDate || difference > 86400000) {
// 				this.viewingDate = currentViewingDate;
// 				const db = database.getDatabase();
// 				const ref = database.ref(
// 					db,
// 					`progress/${this.uid}/practice/${this.taskId}`
// 				);
// 				await database.update(ref, {
// 					viewingDate: currentViewingDate,
// 				});
// 			}
// 		}
// 	};
//
// 	getUnseenAmount = async (userId, taskType, taskId) => {
// 		if (taskType === 'theme') {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		let typeOfTask = taskType;
// 		if (taskType === 'soft-skills') {
// 			typeOfTask = 'practice';
// 		}
// 		const ref = database.ref(
// 			db,
// 			`progress/${userId}/${typeOfTask}/${taskId}`
// 		);
// 		const data = await database.get(ref);
// 		const unseenData = data.toJSON();
// 		if (!unseenData) {
// 			return;
// 		}
// 		let isUnseen = false;
// 		let unseenAmount = 0;
// 		if (unseenData.comments) {
// 			unseenAmount = unseenData?.unseenMessages || 0;
// 			isUnseen = unseenData?.isUnseen || false;
// 		}
//
// 		return {
// 			isUnseen,
// 			unseenAmount,
// 		};
// 	};
//
// 	setUnseenWeekly = async (lessonNum, taskId) => {
// 		if (!lessonNum || !taskId) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${this.uid}/unseenChats`);
// 		const lessonRef = database.child(ref, `lesson-${lessonNum}`);
// 		const newChatUnseen = database.child(lessonRef, taskId);
// 		await database.update(newChatUnseen, { isUnseen: true });
// 	};
//
// 	deleteSeenChat = async () => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`users/${this.uid}/unseenChats/lesson-${this.lessonNum}/${this.taskId}`
// 		);
// 		await database.remove(ref);
// 	};
//
// 	getUnseenWeekly = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/unseenChats`);
// 		const data = await database.get(ref);
// 		const unseenChats = data.toJSON();
// 		if (!unseenChats || Object.keys(unseenChats).length === 0) {
// 			return unseenChats;
// 		}
//
// 		const sentPracticeRef = database.ref(db, `progress/${uid}/practice`);
// 		const sentPracticeData = await database.get(sentPracticeRef);
// 		const sentPractice = sentPracticeData.toJSON();
//
// 		Object.entries(unseenChats).forEach(([weekKey, week]) => {
// 			const weeks = Object.keys(week).filter((chatKey) => {
// 				const chatData = sentPractice[chatKey];
// 				if (chatData?.comments) {
// 					this.#deleteWeeksViewed(chatData, unseenChats, weekKey, uid, chatKey);
// 					return chatKey;
// 				}
// 				delete unseenChats[weekKey][chatKey];
// 			});
//
// 			if (weeks.length === 0 || Object.keys(unseenChats[weekKey]).length === 0) {
// 				delete unseenChats[weekKey];
// 				return
// 			}
// 		});
//
// 		return unseenChats;
// 	};
// 	async #deleteWeeksViewed(chatData, unseenChats, weekKey, uid, chatKey) { //в бд не все прочитанные недели отмеченны такими
// 		let unseenMessage = []
// 		for (const comment of Object.values(chatData.comments)) { //поэтому временно ставим проверку
// 			if (comment.from === 'student' && !comment.seen) {
// 				unseenMessage.push(comment)
// 			}
// 		}
// 		if (!unseenMessage.length) {
// 			const db = database.getDatabase();
// 			const ref = database.ref(
// 				db,
// 				`users/${uid}/unseenChats/${weekKey}/${chatKey}`
// 			);
// 			await database.remove(ref);
// 			delete unseenChats[weekKey];
// 		}
// 	}
//
// 	handleSeenMessages = async (msgId) => {
// 		if (!this.taskId) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}/comments/${msgId}`
// 		);
// 		await database.update(ref, {
// 			seen: true,
// 		});
//
// 		this.changeUnseenStats();
// 		this.deleteSeenChat();
//
// 		runInAction(() => {
// 			this.messagesUnseen = 0;
// 			this.isUnseen = false;
// 		});
// 	};
//
// 	markHomeworkBest = async (bestHomework, group) => {
// 		if (!group) {
// 			return;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `groups/${group}`);
// 		if (bestHomework === true) {
// 			await database.update(ref, { bestHomework: this.uid, });
// 		}
// 	};
//
// 	addCrystall = async (deadlineOverdue, isExtra = false) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}`
// 		);
// 		await database.update(ref, {
// 			isCrystal: deadlineOverdue,
// 			isExtra,
// 		});
// 	};
//
// 	addExtraTaskDone = async (deadlineOverdue) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}`
// 		);
// 		await database.update(ref, {
// 			isExtra: true
// 		});
// 		const message = deadlineOverdue
// 			? 'Отличная работа! Задание со звездочкой проверено, жаль что не уложилась в дедлайн.'
// 			: 'Отличная работа! Ты заработала кристалл за задание со звездочкой!';
//
// 		await this.sendMessage({
// 			from: 'teacher',
// 			comment: message,
// 			markType: 'accepted',
// 			seen: false,
// 		});
//
// 		runInAction(() => {
// 			const messageObj = {
// 				timeSent: this.#timeSent,
// 				seen: false,
// 				from: 'teacher',
// 				markType: 'accepted',
// 				img: false,
// 				link: false,
// 				comment: message,
// 			};
// 			this.messages.push(messageObj);
// 		});
// 	}
//
// 	checkedTaskNotif = async (task, theme, lessonNumber) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${this.uid}/notifs`);
// 		const notifBody = database.push(ref);
// 		await database.update(notifBody, {
// 			date: this.#timeSent,
// 			text: 'Ура! Твоя домашняя работа прошла проверку учителя.',
// 			taskId: task,
// 			topic: 'Проверка ДЗ',
// 			notice: theme,
// 			weekNumber: lessonNumber,
// 			urgency: 2,
// 			seen: false,
// 		});
// 	};
//
// 	sendMessage = async (message) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}/comments`
// 		);
// 		const messageRef = database.push(ref);
// 		await database.update(messageRef, {
// 			timeSent: this.#timeSent,
// 			...message
// 		});
// 	}
//
// 	editMessage = async (commentId, text, link = null, chatsStore, usersStore) => {
// 		const message = this.messages.find((msg) => msg.commentId === commentId);
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}/comments/${commentId}`
// 		);
//
// 		message.comment = text;
// 		message.link = link;
// 		await database.update(ref, message);
// 		await this.#editMessageInChats(chatsStore, usersStore, message);
//
// 		runInAction(() => {
// 			for (const message of this.messages) {
// 				if (message.commentId === commentId) {
// 					message.comment = text;
// 					message.link = link;
// 				}
// 			}
// 		})
// 	}
//
// 	async #editMessageInChats(chatsStore, usersStore, message) {
// 		let isHiddenMentor = usersStore.getAnonymousUser();
// 		const ids = [this.uid, isHiddenMentor.uid]
// 		const chat = await chatsStore.getAnonymousChatById(ids);
//
// 		const editingMessage = Object.values(chat.messages)
// 			.find(item => item.taskId === this.taskId);
//
// 		if (editingMessage?.messageId) {
// 			await chat.editMessage(editingMessage.messageId, message.comment, message.link);
// 		}
// 	}
//
// 	deleteMessage = async (commentId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}/comments/${commentId}`
// 		);
// 		await database.remove(ref);
// 		runInAction(() => {
// 			this.messages = this.messages.filter(item => item.commentId !== commentId);
// 		});
// 	}
//
// 	markHomeworkAccepted = async (theme, weekNumber, isExtra, mentorUid, deadlineOverdue) => {
// 		const db = database.getDatabase();
//
// 		const checkRef = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}/needToCheckAt`
// 		);
// 		await database.remove(checkRef);
//
// 		const message = deadlineOverdue
// 			? 'Отличная работа. Жаль, что не уложилась в дедлайн.'
// 			: 'Отличная работа! Ты заработала кристалл!'
//
// 		await this.sendMessage({
// 			from: 'teacher',
// 			comment: message,
// 			markType: 'accepted',
// 			seen: false,
// 		});
// 		this.setLoaded(false);
// 		await this.addCrystall(!deadlineOverdue, isExtra);
// 		await this.checkedTaskNotif(this.taskId, theme, weekNumber);
// 		await this.setHomeworkStatus('accepted');
// 		await this.setHomeworkMentor(mentorUid);
// 	};
//
// 	getStdWeeklyCrystals = async (uid, lessonId) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${uid}/crystals/${lessonId}`);
// 		const stdCrystalData = await database.get(ref);
// 		if (!stdCrystalData) {
// 			return null;
// 		}
// 		const crystalsInfo = stdCrystalData.toJSON() || { hardSkills: 0, softSkills: 0 };
// 		return crystalsInfo;
// 	};
//
// 	updateCrystalsProgress = async (lessonId, taskType, crystalsNum) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `progress/${this.uid}/crystals/${lessonId}`);
// 		if (taskType === 'soft-skills') {
// 			await database.update(ref, { softSkills: crystalsNum });
// 		} else {
// 			await database.update(ref, { hardSkills: crystalsNum });
// 		}
// 	};
//
// 	changeCheckDate = async () => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(
// 			db,
// 			`progress/${this.uid}/practice/${this.taskId}/needToCheckAt`
// 		);
// 		const updatedDate = Date.now() + 1000 * 60 * 60 * 24 * 7;
// 		await database.set(ref, updatedDate);
// 	};
//
// 	submitHomeworkForRework = async (homeworkRemark, theme, lessonNumber, mentorUid) => {
// 		await this.setHomeworkStatus('rework');
// 		await this.setHomeworkMentor(mentorUid);
// 		await this.sendMessage({
// 			from: 'teacher',
// 			comment: `Ой! Твое задание пока не принято. Исправь следующее: ${homeworkRemark}`,
// 			markType: 'declined',
// 			seen: false,
// 		})
// 		await this.changeCheckDate();
// 		this.setLoaded(false);
// 		await this.addCrystall(false);
// 		await this.checkedTaskNotif(this.taskId, theme, lessonNumber);
// 	};
//
// 	setLoaded(value) {
// 		this.isLoaded = value;
// 	}
//
// 	submitHomeworkForReReview = () => {
// 		const message = {
// 			from: 'student',
// 			comment: `Домашнее задание исправлено и готово к повторной проверке.`,
// 			markType: 'corrected',
// 			seen: false,
// 			timeSent: this.#timeSent,
// 		}
// 		this.setHomeworkStatus('re-review');
// 		this.sendMessage(message);
//
// 		runInAction(() => {
// 			this.messages.push(message);
// 		})
// 	};
//
// 	reset = () => {
// 		this.taskId = null;
// 		this.uid = null;
// 		this.lessonNum = null;
// 		this.messages = [];
// 		this.isLoaded = false;
// 		this.homeworkStatus = undefined;
// 	}
// }
