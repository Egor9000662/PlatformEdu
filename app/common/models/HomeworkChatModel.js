export default class HomeworkChatModel {

	/**@private {HometaskChatStore}*/
	#hometaskChatStore;

	/**@private {UsersStore}*/
	#usersStore;

	/**@private {ProgressStore}*/
	#progressStore;

	/**@private {GroupStore}*/
	#oneGroupStore;

	#groupId;

	constructor(hometaskChatStore, groupId, usersStore, progressStore, oneGroupStore) {
		this.#hometaskChatStore = hometaskChatStore;
		this.#groupId = groupId;
		this.#usersStore = usersStore;
		this.#progressStore = progressStore;
		this.#oneGroupStore = oneGroupStore;
	}

	get studentSentTask() {
		let studentSentTask = false;
		if (this.#hometaskChatStore.messages?.length > 0) {
			studentSentTask = this.#hometaskChatStore.messages.find((msg) => {
				return msg.from === 'student';
			});
		}
		return studentSentTask;
	}

	get taskChecked() {
		let taskChecked = false;
		for (let message of this.#hometaskChatStore.messages) {
			if (message.markType === 'accepted') {
				taskChecked = true;
			}
		}
		return taskChecked;
	}

	/**
	 * @param {Object} student
	 * @returns {boolean}
	 */
	getStudentHometaskFeedback(student) {
		const feedbackInfo = student?.feedback;
		let formatFeedback;
		if(feedbackInfo?.hometask) {
			formatFeedback = Object.entries(feedbackInfo.hometask).map(
				([key, value]) => {
					return { ...value, id: key};
				}
			);
		}
		if(formatFeedback) {
			return true
		}else return false;
	}

	/**
	 * @param {boolean} deadlineOverdue
	 * @param {Object} student
	 * @param {string} weekId
	 * @param {string} taskType
	 * @returns {Promise<void>}
	 */
	async markHomeworkIsExtra(deadlineOverdue, student, weekId, taskType) {
		await this.#hometaskChatStore.addExtraTaskDone(deadlineOverdue);
		if(!deadlineOverdue) {
			let crystals = await this.#hometaskChatStore.getStdWeeklyCrystals(student.uid, weekId);
			const crystalsNum = crystals.hardSkills + 1;
			await this.#hometaskChatStore.updateCrystalsProgress(weekId, taskType, crystalsNum);
		}
	}

	/**
	 * @param {Object} student
	 * @returns {Promise<boolean>}
	 */
	getBestHomework(student) {
		return this.#oneGroupStore.getBestHomework(this.#groupId)
			.then((res) => res === student.uid);
	}

	/**
	 * @param {string} taskType
	 * @param {string} taskId
	 * @returns {boolean|*}
	 */
	getExtraTask(taskType, taskId) {
		const progress = this.#progressStore?.progress[taskType];
		const taskData = progress[taskId];
		return taskData?.isExtra || false;
	}

	/**
	 * @param {string} role
	 * @returns {unknown[] | undefined}
	 */
	async getMessages(role) {
		return this.#hometaskChatStore.messages?.filter(
			(msg) => {
				if(!msg.seen && msg.from !== role && role !== 'admin'){
					this.#hometaskChatStore.handleSeenMessages(msg.commentId);
				}
			}
		);
	}

	/**
	 * @param {string} role
	 * @param {Object} student
	 * @returns {Promise<undefined|object>}
	 */
	async getStudentStatus(role, student) {
		if(role === 'teacher') {
			return await this.#usersStore.getStudentStatus(student.uid)
		}
	}

	/**
	 * @param messagesEndRef
	 */
	scrollChatDown(messagesEndRef) {
		if(messagesEndRef && messagesEndRef.current) {
			const element = messagesEndRef.current;
			element.scroll({
				top: element.scrollHeight,
				left: 0,
				behavior: "smooth"
			})
		}
	};
}
