export default function getFormattedCourseName(courseName) {
	if(!courseName) return ;
	const course = courseName.split(' ');
	return course[0];
}
