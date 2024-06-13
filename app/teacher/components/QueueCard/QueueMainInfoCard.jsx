import React, { useState } from 'react';
import './QueueCard.scss';
import iconEdit from '../../../common/assets/controls/icon-edit.svg';
import ChooseBlocksModal from './ChooseBlocksModal';
import { v4 as uuidv4 } from 'uuid';

export default function QueueMainInfoCard({
	freeTasksAmount,
	handleTakeTask,
	mentorId,
	chosenModules,
	setChosenModules,
	modules,
	canTakeHomework,
}) {
	const [chooseBlockModalVisible, setChooseBlockModalVisible] =
		useState(false);

	const showEditModal = (value) => {
		setChooseBlockModalVisible(value);
	};

	const buttonClassName =
		!canTakeHomework
			? 'greyBtn queue-btn'
			: 'greenBtn queue-btn';

	return (
		<div className="queue-card queue-mainInfo">
			<p className="queue-card__info">
				Свободных заданий: {freeTasksAmount}
			</p>
			<p className="queue-card__info">
				Выбранные модули на проверку:{' '}
				{chosenModules.map((el) => {
					return (
						<span className="queue-card__module" key={uuidv4()}>
							{el}
						</span>
					);
				})}
				<button type="button" onClick={() => showEditModal(true)}>
					<img className="icon" src={iconEdit} alt="edit" />
				</button>
				<ChooseBlocksModal
					modules={modules}
					setChosenModules={setChosenModules}
					mentorId={mentorId}
					visible={chooseBlockModalVisible}
					handleEditVisible={showEditModal}
				/>
			</p>
			<button
				onClick={handleTakeTask}
				className={buttonClassName}
				disabled={!canTakeHomework}
			>
				{' '}
				Получить задание
			</button>
			<p className="queue-card__notice">
				{' '}
				Обратите внимание, что на проверку задания вам отводится 24
				часа. Оставшееся время отображается на карточке принятого
				задания. По истечении этого времени задание будет возвращено в
				очередь.
			</p>
		</div>
	);
}
