export default function checkHomeworkSubmission(progress, taskId, setTaskSent, taskType, weekId) {
	let currentTask = '';
	if (progress?.practice) {
		const practiceInfo = Object.entries(progress.practice).map(
			([key, value]) => ({
				taskId: key,
				...value,
			})
		);
		currentTask = practiceInfo.find((task) => task.taskId === taskId);
	}
	if (currentTask) {
		setTaskSent(true);
	}
	if (taskType === 'soft-skills') {
		if (progress?.crystals) {
			const crystalTask = progress?.crystals[weekId]?.softSkills;
			if (crystalTask) {
				setTaskSent(true);
			}
		}
	}
}
