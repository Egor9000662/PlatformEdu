import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import Counter from "../../../common/components/Counter/Counter";

export default observer(function HomeworkCard({
    task,
	unseenMessages,
}) {

	const handlePathName = () => {
		localStorage.setItem('pathName', location.pathname);
	};

	return (
		<div className="queue-card">
			<div className="queue-card__taskInfo">
				<p className="queue-card__info">Тема: {task.taskName}</p>
				<p className="queue-card__info">Неделя: {task.week}</p>
				<span className="queue-card__info">
					<Link
						to={`/task/${task.course}/${task.taskId}`}
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
						}}
						onClick={handlePathName}
					>
						Перейти
					</Link>
				</span>
			</div>
				<div className="queue-card__controls">
					<div className="week_counter">
						<Counter num={unseenMessages || 0} />
					</div>
					{task?.homeworkStatus === 'rework' && (
						<div className="queue-card__info_onRework">
							На доработке
						</div>
					)}
					{task?.homeworkStatus === 're-review' && (
						<div className="queue-card__info_onRework-lightRedColor">
							Доработано
						</div>
					)}
					{task?.homeworkStatus === 'accepted' && (
						<div className="queue-card__info_onRework-lazure">
							Проверено
						</div>
					)}

				</div>
		</div>
	);
});
