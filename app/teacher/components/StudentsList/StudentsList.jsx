import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, useParams } from 'react-router-dom';
import Student from '../Student/Student';
import Input from '../../../common/components/Input/Input';
import MagnifierIcon from '../../../common/assets/controls/icon-magnifier.svg';
import './StudentsList.scss';
import StudentList from "../../Models/StudentList";

function StudentsList({
	lessonsStore,
	studentList,
}) {
	const [searchName, setSearchName] = useState('');
	const [isModalNextWeekVisible, setIsModalNextWeekVisible] = useState(false);
	const [isBestHometaskId, setIsBestHometaskId] = useState('');
	const [studentsProgress, setStudentsProgress] = useState([]);

	useEffect(async () => {
		await studentList.group.getBestHomework(studentList.group.id).then((res) => {
			setIsBestHometaskId(res);
		});
	}, [studentList.group]);

	useEffect(async ()=>{
		setStudentsProgress(await studentList.getStudentAllProgress())
	}, [studentList.group.studentsList, lessonsStore.lessons]);


	const handleNextWeekButton = (e) => {
		if (isModalNextWeekVisible) {
			e.preventDefault();
		} else undefined;
	};

	const students = studentList.getMentorStudents(searchName);

	return (
		<>
			<div className="searchInput">
				<Input
					className="searchInput-input"
					placeholder="Почта, имя, фамилия"
					onChange={(event) => {setSearchName(event.target.value);}}
				/>
				<img
					className="searchInput-icon"
					src={MagnifierIcon}
					alt="magnifier-icon"
				></img>
			</div>
			<div className="students-list">
				{students.map((student) => (
						<Link
							to={`/student-profile/${student.uid}`}
							key={student.uid}
							onClick={handleNextWeekButton}
						>
							<Student
								student={student}
								schedule={studentList.schedule}
								currentWeek={studentList.currentWeek}
								setIsModalNextWeekVisible={
									setIsModalNextWeekVisible
								}
								studentProgress={studentsProgress.find(
									(item) => item.uid === student.uid
								)}
								isBest={studentList.bestStudents
										? Object.values(studentList.bestStudents).includes(student.uid)
										: null}
								isBestHometask={isBestHometaskId === student.uid}
							/>
						</Link>
					))}
			</div>
		</>
	);
}

export default inject(
	({
		groupsStore,
		oneGroupStore,
		progressStore,
		lessonsStore,
	}) => {
		const { id: groupId } = useParams();
		const group = groupsStore.getGroup(groupId);

		useEffect(()=>{
			lessonsStore.loadData(group.course);
		},[groupId])

		useEffect(async () => {
			await group.setBestStudents(group.week?.weekNumber);
		}, [group.studentsList]);

		const studentList = new StudentList(group, groupsStore, lessonsStore, progressStore);

		return {
			lessonsStore,
			studentList,
		};
	}
)(observer(StudentsList));
