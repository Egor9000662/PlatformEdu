import React, {useEffect} from 'react';
import './StudentProfile.scss';
import { useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import StudentName from '../../components/StudentName/StudentName';
import crystalYellow from '../../../common/assets/сrystals/crystallHardSkills.svg';
import HomeworkCard from "../../components/HomeworkCard/HomeworkCard";
import StudentProfileData from "../../Models/StudentProfileData";

function StudentProfile({ studentUid, student, progressStore, studentProfile }) {

	if (!student.isLoaded) {
		return null;
	}

	let homeworks = [];
	if(progressStore?.progress?.practice){
		homeworks = studentProfile.getStudentHomeworks();
	}
	return (
		<>
			<div className="top-container">
				<div className="studentProfile_container">
					<div>
						<BackArrow pathName={`/groups/${studentProfile.group}`} />
					</div>
					<div className="student_name">
						<StudentName {...studentProfile.student} key={studentUid} />
					</div>
				</div>
			</div>
			<div className="student_crystals">
				<img
					className="week_crystal_icon"
					src={crystalYellow}
					alt="crystal"
				/>
				<div className="student_crystals_sum">{studentProfile.getAllCrystals()}</div>
			</div>
			<div className="studentProfile_weeks"></div>
			<div className="studentProfile_weeks-container">
				{homeworks.length
					? homeworks.map((homework) => (
						<HomeworkCard
							key={homework.taskId}
							task={homework}
							unseenMessages={studentProfile.getUnseenMessagesCount(homework)}
						/>
					))
					: <p className="studentProfile_weeks-container_text">Тут пока ничего нет...</p>
				}
			</div>
		</>
	);
}

export default inject(({ usersStore, progressStore}) => {
	const { id: studentUid } = useParams();
	useEffect(()=>{
		usersStore.loadData();
	},[usersStore.isLoaded])

	const student = usersStore.getUser(studentUid);

	useEffect(() => {
		student.loadData(studentUid);
		student.getCrystals();
		progressStore.getProgress(studentUid);
	}, [studentUid, student.isLoaded]);

	const studentProfile = new StudentProfileData(student, progressStore);

	return {
		studentUid,
		student,
		progressStore,
		studentProfile,
	};
})(observer(StudentProfile));
