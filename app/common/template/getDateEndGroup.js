export default function getDateEndGroup(schedule) {
	const lessons = Object.values(schedule).sort(
		(a, b) => a.lessonNumber || a.weekNumber - b.lessonNumber || b.weekNumber); //todo
	const lastLesson = lessons[lessons.length - 1];
	return lastLesson.dateEnd;
}
