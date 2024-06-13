/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import CrystalImg from '../../../common/assets/сrystals/crystallHardSkills.svg';
import './EstimationWindow.scss';

function EstimationWindow({
	currentMentorInfo,
	showEstimationModalForm,
	setExtraChecked,
	homeworkObj,
	homeworkAssessment,
	hometaskChatStore,
}) {
	const [declined, setDeclined] = useState(false);
	const [extraTask, setExtraTask] = useState(false);
	const [remarkValue, setRemarkValue] = useState('');

	useEffect(() => {
		hometaskChatStore.getPracticeProgress(homeworkObj.uid);
	}, []);

	const handleAcceptingTask = async () => {
		setExtraChecked(extraTask)
		showEstimationModalForm(false);
		homeworkAssessment.accept(currentMentorInfo, homeworkObj, extraTask);
	};

	const handleSendRemark = async () => {
		setDeclined(false);
		showEstimationModalForm(false);
		homeworkAssessment.decline(remarkValue, homeworkObj, currentMentorInfo);
	};

	return (
		<div>
			{!declined ? (
				<>
					<div className="est-main">
						<h1 className="est-header">
							Оценить домашнее задание
						</h1>
						<div className="est-crystal">
							<img src={CrystalImg} alt="crystall" />
						</div>
						{homeworkObj.taskType === 'practice' && (
							<div className="est-setting">
								<div className="est-text">Задание со звездочкой</div>
								<div className="est-toggle">
									<input
										type="checkbox"
										className="est-slider"
										onChange={() => setExtraTask(!extraTask)}
									/>
								</div>
							</div>
						)}
					</div>
					<div className="est-btns">
						<button
							className="est-btns__accept est-btn"
							onClick={handleAcceptingTask}
						>
							Принять
						</button>

						<button
							className="est-btns__decline est-btn"
							onClick={() => setDeclined(true)}
						>
							Вернуть доработать
						</button>
					</div>
				</>
			) : (
				<div className="est-remark">
					<div className="est-remark__main">
						<h3 className="est-remark__title">Почему вы не принимаете домашнее задание?</h3>
						<textarea
							className="est-remark__text"
							placeholder="Ваш комментарий..."
							value={remarkValue}
							onChange={(e) => setRemarkValue(e.target.value)}
						></textarea>
					</div>
					<button
						className="est-remark__btn est-btn"
						onClick={handleSendRemark}
						disabled={remarkValue === ''}
					>
						Отправить
					</button>
				</div>
			)}
		</div>
	);
}

export default inject(
	({
		auth,
		hometaskChatStore,
		usersStore,
		mentorsStore,
		homeworksStore,
		oneMentorStore,
		progressStore,
		createHomeworkAssessmentFactory,
	}) => {
		const { uid: mentorUid } = auth.user;

		const currentMentorInfo = mentorsStore.mentors?.find(
			(mentor) => mentor.uid === mentorUid
		);

		useEffect(() => {
			if (currentMentorInfo?.id) {
				oneMentorStore.loadData(currentMentorInfo.id)
				oneMentorStore.getHomeworks(currentMentorInfo.id);
				oneMentorStore.getMentorStudents(currentMentorInfo.id);
			}
		}, [currentMentorInfo]);

		const homeworkAssessment = createHomeworkAssessmentFactory(
			hometaskChatStore,
			usersStore,
			oneMentorStore,
			homeworksStore,
			mentorsStore,
			progressStore
		);

		useEffect(() => {
			homeworkAssessment.loadData();
		}, [homeworkAssessment.isLoaded]);

		return {
			currentMentorInfo,
			homeworkAssessment,
			hometaskChatStore,
		};
	}
)(observer(EstimationWindow));
