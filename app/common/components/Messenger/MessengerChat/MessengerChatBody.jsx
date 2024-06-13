import React, { useRef, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import './MessengerChat.scss';
import HomeworkChatBody from '../../HomeworkChat/HomeworkChatBody.jsx';
import HomeworkChatControls from '../../HomeworkChat/HomeworkChatControls.jsx';
import HomeworkChatForm from '../../HomeworkChat/HomeworkChatForm.jsx';

function MessengerChatBody({
	student,
	taskChat,
	messages,
	loadMessages,
	isLoadedChat,
	getTasks,
	handleSeenMessages,
	mentorsGroups,
	isLostPriority,
}) {
	if (!student) {
		return;
	}

	const course = student?.course;
	const lessonId = taskChat?.lesson;
	const block = taskChat?.block;
	const [taskType, setTaskType] = useState('practice');
	useEffect(() => {
		getTasks(course, `lesson-${lessonId}`).then((val) => {
			if (val) {
				const allTasksData = Object.values(val);
				const currentTask = allTasksData.find(
					(task) => task.id === taskChat.taskId
				);
				if (taskType !== currentTask.type) {
					setTaskType(currentTask.type);
				}
			}
		});
	}, [student, taskChat]);
	useEffect(async () => {
		loadMessages(student.uid, taskChat?.taskId, taskChat?.lesson);
	}, [isLoadedChat]);

	const timerRef = useRef(null);
	timerRef.current = setTimeout(async () => {
		loadMessages(student.uid, taskChat?.taskId, taskChat?.lesson);
	}, 1000);

	useEffect(async () => {
		return () => clearTimeout(timerRef.current);
	}, []);

	useEffect(() => {
		messages?.filter(
			(msg) => msg.from !== 'teacher' && handleSeenMessages(msg.commentId)
		);
	}, [messages]);

	const isMentorsStudent = mentorsGroups.find(
		// (group) => group.id === student.group
		(group) => student.groups.some((group) => group.groupId === group.id)
	)
		? true
		: false;

	return (
		<>
			{taskChat && (
				<Link to={`/task/${course}/${taskChat?.taskId}`} target="_blank">
					<div className="messengerChat__show-hw">
						Смотреть задание
					</div>
				</Link>
			)}
			{isLostPriority && !taskChat && (
				<div className="priorityWarningContainer">
					<div className="priorityWarning">
						<p>
							Этот студент был проверен другим преподавателем,
							который является для него приоритетным.
						</p>
						<p>Вы уверены, что хотите проверить этого студента?</p>
					</div>
				</div>
			)}
			{taskChat && (
				<div className="messengerChat-body">
					<div className="messengerChat-messagesContainer">
						<HomeworkChatBody role={'teacher'} />
					</div>
					<div className="messengerChat-controls">
						<HomeworkChatControls
							role={'teacher'}
							uid={student.uid}
							lessonNumber={taskChat?.lesson}
							taskId={taskChat?.taskId}
							themeName={taskChat?.taskName}
							taskType={taskType}
							block={block}
							messages={messages}
							pageType={'messenger'}
							isUnchecked={student.isUnchecked || false}
							isMentorsStudent={isMentorsStudent}
						/>
					</div>
					<div className="messengerChat-formContainer">
						<HomeworkChatForm
							role={'teacher'}
							lessonNumber={taskChat?.lesson}
							taskId={taskChat?.taskId}
						/>
					</div>
				</div>
			)}
		</>
	);
}

export default inject(({ hometaskChatStore, lessonsStore }) => {
	const {
		messages,
		loadData: loadMessages,
		isLoaded: isLoadedChat,
		handleSeenMessages,
	} = hometaskChatStore;
	const { getTasks } = lessonsStore;

	return {
		messages,
		loadMessages,
		isLoadedChat,
		getTasks,
		handleSeenMessages,
	};
})(observer(MessengerChatBody));
