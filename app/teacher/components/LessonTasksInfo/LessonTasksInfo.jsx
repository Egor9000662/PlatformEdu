import React, { useEffect, useState } from 'react';
import './LessonTasksInfo.scss';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import { inject, observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import LessonTaskCard from './LessonTaskCard';
import HomeButon from '../../../common/components/HomeButton/HomeButton';

function LessonTasksInfo({ lesson, id }) {
	if (!lesson.isLoaded) {
		return null;
	}

	return (
		<div className="student_lessons_learned">
			<div className="lessons_tasks_header">
				<div className="lessons_tasks_header__btn">
					<BackArrow pathName={`/student-profile/${id}`} />
				</div>
				<h1 className="lessons_tasks_lesson">
					Неделя {lesson.lessonNumber}
				</h1>
				<div className="lessons_tasks_header__btn">
					<HomeButon />
				</div>
			</div>
			{lesson.tasks
				?.filter(
					(task) => task.type === 'practice' || task.type === 'test'
				)
				.map((task) => {
					return (
						<LessonTaskCard
							{...task}
							block={lesson.block}
							lessonNumber={lesson.lessonNumber}
							key={`${task.id} - ${task.type}`}
						/>
					);
				})}
		</div>
	);
}

export default inject(({ lessonsStore, oneCourseStore }) => {
	const { id, lessonId } = useParams();
	const { getLesson } = lessonsStore;
	const { getStudentCourse } = oneCourseStore;
	const [loading, setLoading] = useState(false);
	const [course, setCourse] = useState('');

	useEffect(async () => {
		const studentCourseInfo = getStudentCourse(id);
		studentCourseInfo.then((val) => {
			setCourse(val.course);
		});
		setLoading(true);
	}, [loading]);

	const lesson = getLesson(lessonId);

	useEffect(() => {
		lesson.loadData(course);
	}, [course]);

	return {
		lesson,
		id,
	};
})(observer(LessonTasksInfo));
