export default class LessonPageController{
	#lesson;
	#student;
	#currentCourse;
	#currentGroup;

	constructor(lesson, student, course, currentGroup) {
		this.#lesson = lesson;
		this.#student = student;
		this.#currentCourse = course;
		this.#currentGroup = currentGroup;
	}

	get tasks() {
		return this.#lesson?.lesson.lessonTasks;
	}

	get accessGranted() {
		if (!this.#currentGroup) {
			return false;
		}
		const groupStartDate = new Date(this.#currentGroup.group.startDate.split(' ')[0]).getTime();
		const now = Date.now();
		return now >= groupStartDate;
	}

	async getTasksRecordsMaps(setTitleTask, setIsTheme) { // старый вариант с использованием ноушен
		const courseName = (this.#currentCourse === "Frontend 2.0") ? "frontend-2": null;
		let tasksRecordMaps = [];
		if(this.tasks) {
			for (let task of this.tasks) {
				if (task.task.type === 'THEME') {
					setTitleTask(task.title);
					setIsTheme(true);
				}
				if (task.task.type !== 'TEST') {
					await import(
						/* webpackInclude: /\.json$/ */
						`/app/modules/notion/${courseName}/pages/1-f498fb314aca44669b12f3e8295bd672.json`
						).then((module) => {
						tasksRecordMaps.push({
							...module.default,
							id: "1-f498fb314aca44669b12f3e8295bd672", // сообщить бэку, что у тасок должен быть определенный id
							type: task.task.type,
							name: task.title,
						});
					});
				}
			}
		}
		return tasksRecordMaps || [];
	}

	getNotionLink() {
		Array.from(document.querySelectorAll('a.notion-page-link')).map(
			(npElem) => {
				const npLinkDefault = npElem.href;
				const npLinkLastPart = npLinkDefault.split('/').pop();
				const npLink = 'https://itgirlschool.notion.site/' + npLinkLastPart;
				npElem.href = npLink;
				npElem.onclick = function (e) {
					e.preventDefault();
					window.open(npElem.href, '_blank');
				};
			}
		);
	}
}
