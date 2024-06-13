export default class SidebarModel {

	getLessonCount = (studentData, courseName) => {
		const selectedCourse = studentData.courses.find(item => item.name === courseName);
		let lessonCount = 0;
		for (const block of selectedCourse.blocks) {
			lessonCount += block.lessons.length;
		}
		return lessonCount;
	}
}
