export default class GameLevelsController {

	getProgressLesson(lesson) {
		const dateEnd = lesson.dateEnd.split('T')[0];
		const dateStart = lesson.dateStart.split('T')[0];

		const dateEndMilliseconds = new Date(dateEnd).getTime();
		const dateStartMilliseconds = new Date(dateStart).getTime();

		const now = Date.now();
		if (now > dateEndMilliseconds) {
			return 'passed';
		} else if (now > dateStartMilliseconds && now < dateEndMilliseconds) {
			return 'inProgress';
		} else {
			return '';
		}
	};
}
