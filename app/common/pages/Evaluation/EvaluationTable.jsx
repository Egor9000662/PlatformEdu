import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EvaluationTable.scss';
import BackArrow from '../../components/BackArrow/BackArrow';
import EvaluationString from './EvaluationString';
import { inject, observer } from 'mobx-react';

function EvaluationTable({ id, group, currentLesson, lessons, studentsData }) {
	return (
		<div className="evaluation-container">
			<div className="evaluation-container__header eval-header ">
				<div>
					<BackArrow pathName={`/groups/${group.id}`} />
				</div>
				<div className="eval-header__heading">
					<h3>Успеваемость</h3>
				</div>
			</div>
			<div className="evaluation-container__main eval-main">
				<div className="eval-main__select-container">
					<div>
						<div className="eval-main__select">По неделям</div>
					</div>
				</div>
				<div className="eval-main__table-container">
					<div className="lesson-row">
						{/* <div className="lesson-row__first-cell"></div> */}
						{Object.values(lessons)
							.sort(
								(lesson, nextLesson) =>
									lesson.lessonNumber - nextLesson.lessonNumber
							)
							.map((lesson) => (
								<div
									key={lesson.lessonNumber}
									className={
										currentLesson === lesson.lessonNumber
											? 'col current-column'
											: 'col'
									}
								>
									<div
										className={`table-head-blob ${
											currentLesson === lesson.lessonNumber
												? ''
												: 'normal-blob'
										}`}
									>
										<h2>{lesson.lessonNumber}</h2>
										Lesson
									</div>
								</div>
							))}
					</div>
					{studentsData.map((student) => (
						<EvaluationString
							crystalsInfo={student.crystals}
							key={student.uid}
							student={student.uid}
							studName={student.name}
							lessons={group.schedule}
							group={group.id}
							current={currentLesson}
						/>
					))}
				</div>
			</div>

			<div className="evaluation-container__controls">
				<button type="button" className="download-eval-button">
					Выгрузить в EX
				</button>
			</div>
		</div>
	);
}

export default inject(({ groupsStore, usersStore }) => {
	const { id: groupId } = useParams();
	const { getGroup } = groupsStore;
	const { getUser, getCrystals, loadData } = usersStore;
	const group = getGroup(groupId);
	const lessons = Object.values(group.schedule);

	const students = Object.values(group.studentsList);
	const currentLesson = group.lesson?.lessonNumber;

	const studentsData = students.map((student) => {
		let studId = student.uid;
		let user = getUser(studId);
		user.getCrystals();
		user.loadData();
		return user;
	});

	useEffect(() => {
		group.loadData();
		group.getStudents();
	}, [group.id]);

	return {
		group,
		currentLesson,
		lessons,
		studentsData,
	};
})(observer(EvaluationTable));
