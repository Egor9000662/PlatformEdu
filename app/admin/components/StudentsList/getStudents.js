export default function getStudents(group, searchName) {
	return Object.values(group.studentsList)
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((student) => {
			if (searchName === '') {
				return student;
			}
			if (
				student.name
					.toLowerCase()
					.includes(searchName.toLowerCase())
			) {
				return student;
			}
			return null;
		})
}
