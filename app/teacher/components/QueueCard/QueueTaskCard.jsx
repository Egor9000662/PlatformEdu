import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { formatDateTimeNum } from '../../../modules/format-date';
import './QueueCard.scss';
import Button from '../../../common/components/Button/Button';

export default observer(function QueueTaskCard({
	task,
	setTaskIdToReturn,
	handleCancelHomework,
}) {
	const chatState = {
		lessonNumber: `${task.lessonNumber}`,
		themeName: `${task.taskName}`,
		taskType: `${task.taskType}`,
		block: `${task.block}`,
		homeworkId: `${task.homeworkId}`,
	};

	const handlePathName = () => {
		localStorage.setItem('pathName', location.pathname);
		localStorage.setItem('state', JSON.stringify(chatState));
	};
	const calculateTimeLeft = (time) => {
		const nextDay = new Date(time - 1000);
		nextDay.setDate(nextDay.getDate() + 1);
		const now = new Date();
		const difference = +nextDay - +now;
		let timeLeft = null;

		if (difference > 0) {
			const hoursInfo = Math.floor(difference / (1000 * 60 * 60));
			const minutesInfo = Math.floor((difference / 1000 / 60) % 60);
			const hours = formatDateTimeNum(hoursInfo);
			const minutes = formatDateTimeNum(minutesInfo);
			timeLeft = hours + ':' + minutes;
		}
		return timeLeft;
	};
	const [timeLeft, setTimeLeft] = useState(
		calculateTimeLeft(task.timeTakenIn)
	);

	useEffect(() => {
		setTimeLeft(calculateTimeLeft(task.timeTakenIn));
	}, [task]);

	useEffect(() => {
		if (timeLeft === '00:00' || !timeLeft) {
			setTaskIdToReturn(task.homeworkId);
		}
	}, [timeLeft]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setTimeLeft(calculateTimeLeft(task.timeTakenIn));
		}, 60000);
		return () => clearTimeout(timer);
	});

	return (
		<div className="queue-card">
			<div className="queue-card__taskInfo">
				<p className="queue-card__info">Тема: {task.taskName}</p>
				<p className="queue-card__info">Неделя: {task.lessonNumber}</p>
				<span className="queue-card__info">
					<Link
						to={`/lessons/${task.course}/lesson-${task.lessonNumber}/${task.taskId}`}
						target="_blank"
					>
						<p>Смотреть задание</p>
					</Link>
				</span>
				<p className="queue-card__blockName">{task.block}</p>
				<span className="queue-card__info">
					<Link
						to={{
							pathname: `/chat/${task.uid}/${task.taskId}`,
							state: chatState,
						}}
						onClick={handlePathName}
					>
						Перейти
					</Link>
				</span>
			</div>
			{task.status?.homeworkStatusLoaded() && (
				<div className="queue-card__controls">
					{!task.status.hasBeenReviewed() && (
						<>
							<p className="queue-card__info">{timeLeft}</p>
							<Button
								className="redBtn queue-btn"
								type="submit"
								text="Отказаться"
								value={task.homeworkId}
								onClick={handleCancelHomework}
							></Button>
						</>
					)}
					{task.status.needsReworkByStudent() && (
						<div className="queue-card__info_onRework">
							На доработке
						</div>
					)}
					{task.status.needsReReviewByMentor() && (
						<>
							<p className="queue-card__info">{timeLeft}</p>
							<div className="queue-card__info_onRework-lazure">
								Доработано
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
});
