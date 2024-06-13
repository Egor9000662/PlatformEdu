import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import NotionCard from '../../../common/components/NotionCard/NotionCard';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

function TaskPage({ uid, mentorsStore}) {
	const { course, lessonId, taskId } = useParams();

	if(!mentorsStore.isLoaded) {
		return null
	}

	const currentMentor = mentorsStore.mentors?.find(
		(mentor) => mentor.uid === uid
	);

	let currentTasks = [];
	let homework;
	if (Object.keys(currentMentor?.homeworks).length !== 0) {
		currentTasks = Object.entries(currentMentor.homeworks).map(([key, value]) => ({
			homeworkId: key,
			...value,
		}));
		homework = currentTasks.find((item) => item.taskId === taskId);
	}

	const path = `/lessons/${course}/${lessonId}/${homework.taskType}.html`;

	return (
		<div className="notionPage-container">
			<div className="notionPage-card" key={taskId}>
				<NotionCard path={path} />
			</div>
		</div>
	);
}
export default inject(({auth, mentorsStore})=>{
	const { uid } = auth.user;

	useEffect(()=>{
		mentorsStore.loadData()
	}, [mentorsStore.isLoaded]);

	return{ uid, mentorsStore}

})(observer(TaskPage));

