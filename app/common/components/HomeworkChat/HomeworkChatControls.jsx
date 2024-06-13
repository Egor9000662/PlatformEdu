import React, { useState } from 'react';
import { useEffect } from 'react';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import EstimationWindow from '../../../teacher/components/EstimationWindow/EstimationWindow';
import FeedbackHometask from '../../../student/components/FeedbackWindows/FeedbackHomework/FeedbackHometask';
import HomeworkChatModel from "../../models/HomeworkChatModel";

function TeacherControls({
	taskChecked,
	displayEstimationModalForm,
	handleExtraTask,
	extraChecked,
	handleBestHomework,
	isBestChecked,
}) {
	if (!taskChecked) {
		return (
			<button
				type="button"
				className="homework-button"
				onClick={displayEstimationModalForm}
			>
				Оценить домашнее задание
			</button>
		);
	} else {
		return (
			<div className="homework-buttons-container">
				{!extraChecked && (
					<button
						type="button"
						className=" homework-button homework-button-small"
						onClick={handleExtraTask}
					>
						Принять задание со звездочкой
					</button>
				)}
				{!isBestChecked && (
					<button
						type="button"
						className=" homework-button homework-button-small"
						onClick={handleBestHomework}
					>
						Лучшее задание недели
					</button>
				)}
			</div>
		);
	}
}

function HomeworkChatControls({
	role,
	student,
	practice,
	taskId,
	taskType,
	pageType,
	hometaskChatStore,
	homeworkChatModel,
}) {
	const {week:weekNumber, block, deadlineOverdue, taskName:themeName} = practice;

	const [validFor, setValidFor] = useState('');
	const [estimationFormModalVisible, setEstimationFormModalVisible] = useState(false);
	const [feedbackSentFlag, setFeedbackSentFlag] = useState(false);
	const [feedHometaskModalVisible, setFeedHometaskModalVisible] = useState(false);
	const [extraChecked, setExtraChecked] = useState(false);
	const [isBestChecked, setIsBestChecked] = useState(false);

	const weekId = `week-${weekNumber}`;
	const group = student.group;

	const displayEstimationModalForm = () => {
		setEstimationFormModalVisible(true);
	};

	useEffect(() => {
		setExtraChecked(homeworkChatModel.getExtraTask(taskType, taskId));
		setIsBestChecked(homeworkChatModel.getBestHomework(student));
	}, []);

	useEffect(() => {
		handleCheckValid();
	}, [hometaskChatStore.messages]);

	let taskChecked = homeworkChatModel.taskChecked;

	const handleCheckValid = () => {
		if (role === 'teacher' && homeworkChatModel.studentSentTask) {
			setValidFor('teacher');
		} else if (
			role === 'student'
			&& taskChecked
			&& !homeworkChatModel.getStudentHometaskFeedback(student)
		) {
			setValidFor('student');
		} else {
			setValidFor('');
			return;
		}
	};

	const handleExtraTask = async () => {
		setExtraChecked(true);
		await homeworkChatModel.markHomeworkIsExtra(deadlineOverdue, student, weekId, taskType);
	};

	const handleBestHomework = () => {
		setIsBestChecked(true);
		hometaskChatStore.markHomeworkBest(true, group);
	};

	const handleHomeworkOnReReview = () => {
		hometaskChatStore.submitHomeworkForReReview(themeName, weekNumber);
		hometaskChatStore.setUnseenWeekly(weekNumber, taskId);
	};

	const homeworkObj = {
		uid: student.uid,
		weekNumber,
		taskId,
		theme: themeName,
		taskType,
		block,
		pageType,
		isUnchecked: student.isUnchecked,
		deadlineOverdue,
	};

	return (
		<div className="homework-button-container">
			{role === 'teacher' && validFor === 'teacher' ? (
				<TeacherControls
					taskChecked={taskChecked}
					displayEstimationModalForm={displayEstimationModalForm}
					handleExtraTask={handleExtraTask}
					extraChecked={extraChecked}
					handleBestHomework={handleBestHomework}
					isBestChecked={isBestChecked}
				/>
			) : null}
			<div className="homework-button-container">
				{role === 'student' && hometaskChatStore.needsReworkByStudent() ? (
					<button
						onClick={handleHomeworkOnReReview}
						className="homework-button"
					>
						Проверить повторно
					</button>
				) : null}
				{role === 'student' &&
					validFor === 'student' &&
					!feedbackSentFlag ? (
					<button
						type="button"
						className="homework-button"
						onClick={() => setFeedHometaskModalVisible(true)}
					>
						Оценить проверку домашнего задания
					</button>
				) : null}
			</div>
			<Modal
				open={estimationFormModalVisible}
				onCancel={() => setEstimationFormModalVisible(false)}
				footer={null}
				className="estimation-meetings-modal"
				width="350px"
			>
				<EstimationWindow
					showEstimationModalForm={setEstimationFormModalVisible}
					setExtraChecked={setExtraChecked}
					homeworkObj={homeworkObj}
				/>
			</Modal>
			<Modal
				open={feedHometaskModalVisible}
				onCancel={() => setFeedHometaskModalVisible(false)}
				footer={null}
				className="estimation-meetings-modal"
				width="400px"
			>
				<FeedbackHometask
					showEstimationModalForm={setFeedHometaskModalVisible}
					themeHomework={themeName}
					setFeedbackSentFlag={setFeedbackSentFlag}
					weekId={weekNumber}
					hometaskId={taskId}
				/>
			</Modal>
		</div>
	);
}

export default inject(
	({
		feedbackStore,
		hometaskChatStore,
		progressStore,
		usersStore,
		oneGroupStore,
		 auth,
		oneUserStore,
	}) => {
		const { profile } = auth;
		const groupId = profile?.group;

		const homeworkChatModel = new HomeworkChatModel(
			hometaskChatStore, groupId, usersStore, progressStore, oneGroupStore);

		return {
			hometaskChatStore,
			homeworkChatModel,
		};
	}
)(observer(HomeworkChatControls));
