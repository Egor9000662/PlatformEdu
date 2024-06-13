import React, {useState, useEffect, useRef} from 'react';
import './HomeworkChatPage.scss';
import { inject, observer } from 'mobx-react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import HomeworkChatHeader from '../../components/HomeworkChat/HomeworkChatHeader';
import HomeworkChatControls from '../../components/HomeworkChat/HomeworkChatControls';
import HomeworkChatForm from '../../components/HomeworkChat/HomeworkChatForm';
import HomeworkChatBody from '../../components/HomeworkChat/HomeworkChatBody';
import HomeworkChatModel from "../../models/HomeworkChatModel";

function HomeworkChatPage({
	taskId,
	practice,
	role,
	student,
	hometaskChatStore,
	progressStore,
	homeworkChatModel,
}) {
	// const [userStatus, setUserStatus] = useState('offline');
	const messagesEndRef = useRef(null);
	useEffect(async () => {
		homeworkChatModel.getMessages(role);
		homeworkChatModel.scrollChatDown(messagesEndRef);
		// setUserStatus(homeworkChatModel.getStudentStatus(role, student));
	}, [hometaskChatStore.messages]);
	if(!progressStore.isLoaded || practice === undefined) {
		return null
	}
	return (
		<div className="homeworkChatPage-container">
			<div className="homework-container">
				<HomeworkChatHeader
					role={role}
					practice={practice}
					// userStatus={userStatus}
					stdAvatar={student.avatarURL}
					namestudent={student.name}
					hometaskChatStore={hometaskChatStore}
				/>
				<div className="homework-message-container" ref={messagesEndRef}>
					<HomeworkChatBody role={role} />
				</div>
				<div className="homework-controls">
					<HomeworkChatControls
						role={role}
						student={student}
						practice={practice}
						taskId={taskId}
						taskType={'practice'}
						messages={hometaskChatStore.messages}
						pageType={'chat'}
						// homeworkId={homeworkId}  // очередь пока не используем
					/>
					<div className="homework-form-container">
						{role !== 'admin'
							?<HomeworkChatForm
								role={role}
								weekNumber={practice.week}
								taskId={taskId}
							/>
							: null
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export default inject(
	({auth, usersStore, hometaskChatStore, mentorsStore, progressStore, groupsStore, oneGroupStore, chatsStore}) => {
		const { id: studentUid, taskId } = useParams();
		const { profile } = auth;
		const groupId = profile?.group;

		const student = usersStore.getUser(studentUid);

		useEffect(() => {
			student.loadData();
		}, [student.isLoaded]);

		useEffect(()=>{
			progressStore.getProgress(studentUid);
			usersStore.loadData();
			chatsStore.loadData();
		}, [studentUid]);

		const practice = progressStore?.progress?.practice[taskId];
		useEffect(async () => {
			hometaskChatStore.loadData(studentUid, taskId, practice?.week);
		}, [hometaskChatStore.isLoaded]);

		const homeworkChatModel = new HomeworkChatModel(
			hometaskChatStore, groupId, usersStore, progressStore, oneGroupStore);

		return {
			taskId,
			practice,
			student,
			hometaskChatStore,
			progressStore,
			homeworkChatModel,
		};
	}
)(observer(HomeworkChatPage));
