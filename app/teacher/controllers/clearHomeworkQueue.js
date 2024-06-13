import ProgressStore from "../../common/store/progress";

export default async function clearHomeworkQueue(allHomeworks, usersStore, deleteHomework) {
	if (!allHomeworks || allHomeworks.length === 0) {
		return;
	}

	await Promise.all(Object.entries(allHomeworks).map(
		async ([key, homework]) => {
			const store = new ProgressStore();
			await store.getProgress(homework.uid)
			const practice = store.progress?.practice;
			const task = practice[homework.taskId];
			const comments = task?.comments;
			const checkedPractice = Object.values(comments).some((comment) => {
					return comment.markType === 'accepted'
						|| comment.markType === 'accepted-partly'
						|| comment.markType === 'declined';
				}
			);
			const userFound = usersStore.users.some((user) => user.uid === homework.uid)
			if (checkedPractice || !userFound ) {
				await deleteHomework(key);
			}
		}
	))
};
