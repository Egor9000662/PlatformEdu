import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import FrontendAvatar from '../../../common/assets/defaultAvatars/frontend-avatar.png';
import ProgramCard from '../Program/Program';
import './TeacherInfoPage.scss';
import BackArrow from '../../../common/components/BackArrow/BackArrow';

function TeacherInfoPage({ mentor }) {
	const courses = mentor.courses;
	console.log(mentor)
	return (
		<div className="teacherInfoWrapper">
			<div className="teacherInfo_header">
				<BackArrow pathName={'/profile'} />
			</div>
			<div className="avatarDiv">
				<img
					className="teacherProfileIcon"
					src={FrontendAvatar}
					alt="avatar"
				/>
				<div className="teacherInfo">
					<div className="username">{mentor.name}</div>
					<div className="userSpecialty">{mentor.specialization}</div>
				</div>
				<div className="teacherExperience">
					<p>
						<span className="teacher-miniHeading">Опыт: </span>
						{mentor.experience}
					</p>
					{mentor.generalInfo && <p>{mentor.generalInfo}</p>}
					{mentor.keyCompetence && (
						<p>
							<span className="teacher-miniHeading">
								Ключевые компетенции:
							</span>
							{mentor.keyCompetence}
						</p>
					)}
					<p>
						<span className="teacher-miniHeading">
							Опыт реализации проектов для компаний:{' '}
						</span>
						{mentor.companies}
					</p>
				</div>
			</div>
			<h2 className="teacherProgram">Программы преподавателя</h2>
			<div className="teacherСards">
				{courses.map((course) => (
					<ProgramCard
						key={course.id}
						course={course}
						avatar={FrontendAvatar}
					/>
				))}
			</div>
		</div>
	);
}

export default inject(({ mentorsStore }) => {
	const { getMentor } = mentorsStore;
	const { id } = useParams();
	const mentorStore = getMentor(id);
	const mentor = JSON.parse(JSON.stringify(mentorStore));

	useEffect(() => {
		mentorsStore.loadData();
		mentorStore.loadData();
	}, [id]);

	return {
		mentor,
	};
})(observer(TeacherInfoPage));
