export default function getMentorStudents(studentList, group, searchName){
	return Object.values(studentList)
		.filter((student) => student.course === group.course)
		.filter((student) => {
			if (searchName === '') {
				return student;
			}
			if (student.name.toLowerCase().includes(searchName.toLowerCase())) {
				return student;
			}
			return null;
		})
		.sort((a, b)=> a.unseenChats ? -1 : b.unseenChats ? 1 : 0)
};
