export class BackupManager {
	#backupsTtlDays = 5;
	#backupsMinimumCount = 5;

	#prefix = 'mentorCheckedTasks';
	#indexKey = `${this.#prefix}_index`;

	/** @private {MentorsStore}*/
	#mentorsStore

	constructor(mentorsStore) {
		this.#mentorsStore = mentorsStore;
	}

	/**
	 * @param date {Date}
	 * @returns {string}
	 */
	#calcKey = date => `${this.#prefix}_${date.toJSON()}`;

	/**
	 * @returns {Promise<void>}
	 */
	async backupDataIfItIsTimeTo() {
		const backupDates = this.getBackupDates();
		const now = new Date();
		await this.addFreshBackupIfNeeded(now, backupDates);
		this.removeStaleBackupsIfNeeded(now, backupDates);
		this.setBackupDates(backupDates);
	}

	/**
	 * @returns {Date[]}
	 */
	getBackupDates = () => (JSON.parse(localStorage.getItem(this.#indexKey)) || [])
		.map(d => new Date(d));

	/**
	 * @param {Date[]} dates
	 */
	setBackupDates = dates => localStorage.setItem(this.#indexKey, JSON.stringify(dates));

	/**
	 * @param {Date} now
	 * @param {Date[]} backupDates
	 */
	async addFreshBackupIfNeeded(now, backupDates) {
		const lastBackupDate = backupDates.at(-1);
		if (lastBackupDate) {
			const nextBackupDate = this.calculateNextBackupDate(lastBackupDate);
			if (now < nextBackupDate) {
				return;
			}
		}

		const mentorCheckedTasks = await this.getMentorCheckedTasks();
		localStorage.setItem(this.#calcKey(now), JSON.stringify(mentorCheckedTasks));
		backupDates.push(now);
	}

	/**
	 * @param {Date} lastBackupDate
	 */
	calculateNextBackupDate(lastBackupDate) {
		const nextDate = new Date(lastBackupDate.getTime());
		nextDate.setDate(nextDate.getDate() + 1);
		nextDate.setHours(0, 0, 0, 0);
		return nextDate;
	}

	/**
	 * @returns {Promise<Object<Object>>}
	 */
	async getMentorCheckedTasks() {
		await this.#mentorsStore.loadData();
		return Object.fromEntries(this.#mentorsStore.mentors
			.map(mentor => [mentor.name, mentor.checkedTasks]));
	}

	/**
	 * @param {Date} now
	 * @param {Date[]} backupDates
	 */
	removeStaleBackupsIfNeeded(now, backupDates) {
		const dateToRemoveBackupsBefore = new Date(now.getTime());
		dateToRemoveBackupsBefore.setDate(now.getDate() - this.#backupsTtlDays);

		const indexToRemoveBefore = backupDates
			.findIndex(backupDate => backupDate >= dateToRemoveBackupsBefore);
		const staleBackupsCount = indexToRemoveBefore === -1
			? backupDates.length : indexToRemoveBefore;
		const backupsToRemoveCount = Math.min(staleBackupsCount,
			backupDates.length - this.#backupsMinimumCount)

		if (backupsToRemoveCount <= 0) {
			return;
		}

		const backupsToRemove = backupDates.splice(0, backupsToRemoveCount);
		for (const backupDate of backupsToRemove) {
			localStorage.removeItem(this.#calcKey(backupDate));
		}
	}
}
