import React, { useState } from 'react';
import chat from '../../assets/vector_chat.png';
import crystalBlue from '../../assets/crystal_blue.png';
import { Link } from 'react-router-dom';
import {
	useLocation,
	useParams,
} from 'react-router-dom/cjs/react-router-dom.min';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';

function LessonTaskCard({
	title,
	type,
	id,
	lessonNumber,
	getCrystalsLessonTask,
	getUnseenAmount,
	location,
	block,
}) {
	const taskId = id;
	const { id: uid } = useParams();
	const [isCrystal, setIsCrystal] = useState(false);
	const [isExtraTask, setIsExtraTask] = useState(false);
	const [unseenAmount, setUnseenAmount] = useState(0);

	useEffect(async () => {
		const taskData = await getCrystalsLessonTask(uid, type, taskId);
		setIsCrystal(taskData.crystal);
		setIsExtraTask(taskData.extraTask);
		const unseenData = await getUnseenAmount(uid, type, taskId);
		setUnseenAmount(unseenData?.unseenAmount || 0);
	}, []);
	const chatState = {
		lessonNumber: `${lessonNumber}`,
		themeName: `${title}`,
		taskType: `${type}`,
		block: `${block}`,
	};
	const handlePathName = () => {
		localStorage.setItem('pathName', location.pathname);
		localStorage.setItem('state', JSON.stringify(chatState));
	};
	return (
		<div className="lesson_card">
			<div className="lesson_card__name">{title}</div>
			<div className="lesson_card__body">
				<div className="lesson_crystals">
					<img
						className="lesson_crystals__icon"
						src={crystalBlue}
						alt="crystal"
					/>
					<div className="lesson_crystals__sum">
						{isExtraTask ? 2 : isCrystal ? 1 : 0}
					</div>
				</div>

				{type === 'practice' ? (
					<Link
						to={{
							pathname: `/chat/${uid}/${taskId}`,
							state: chatState,
						}}
						onClick={handlePathName}
					>
						<div className="lesson_chat">
							<img
								className="lesson_chat__icon"
								src={chat}
								alt="chat"
							/>
							<div className="lesson_chat__messages">
								{unseenAmount}
							</div>
						</div>
					</Link>
				) : (
					''
				)}
			</div>
		</div>
	);
}

export default inject(({ lessonsStore, hometaskChatStore }) => {
	const { getCrystalsLessonTask } = lessonsStore;
	const { getUnseenAmount } = hometaskChatStore;
	const location = useLocation();
	return {
		getCrystalsLessonTask,
		getUnseenAmount,
		location,
	};
})(observer(LessonTaskCard));
