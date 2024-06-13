import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import Counter from "../Counter/Counter.jsx";
import teacherAvatar from '../../assets/defaultAvatars/cat-avatar.svg';
import defaultAvatar from '../../assets/defaultAvatars/frontend-avatar.png';
import './Chat.scss';

const Chat = ({ auth, usersStore, uid, chatsStore, chatStore, mentorsStore, progressStore }) => {
	const [userStatus, setUserStatus] = useState('offline');
	const [counter, setCounter] = useState(0);
	const [currentChat, setCurrentChat] = useState();
	const ids = [auth.user.uid, uid];
	const isMentor = mentorsStore.isMentor(uid);
	const user = isMentor ? mentorsStore.getMentor(uid) : usersStore.getUser(uid);
	const isAnonymous = usersStore.isAnonymous(uid);

	const userStatusHandler = async () => {
		const status = await usersStore.getStudentStatus(uid);
		setUserStatus(status);
	}

	const setChat = async () => {
		const chat = await chatsStore.getChatByIds(ids);
		setCurrentChat(chat);
	};

	const getAnonymousChatCount = async () => {
		const tasks = await currentChat.getTaskIds();
		let unseenHomeworkChats = 0;
		for (const taskId of tasks) {
			const unseenMessages = await progressStore.getTaskUnseenMessages(auth.user.uid, taskId);
			unseenHomeworkChats += unseenMessages;
		}
		setCounter(unseenHomeworkChats);
	}

	useEffect(() => {
		setChat();
		userStatusHandler();
	}, []);

	useEffect(() => {
		if (!currentChat) {
			return;
		}

		if (chatStore.uid === currentChat?.uid) {
			chatStore.setData(currentChat);
			currentChat.setSeenMessages(auth.user.uid);
		}
		if (currentChat.isAnonymous) {
			getAnonymousChatCount();
		} else {
			setCounter(currentChat.getUnseenMessagesCount(auth.user.uid));
		}
	}, [currentChat?.messages, chatStore.messages]);

	return (
		<div className={chatStore.uid === currentChat?.uid ? 'chat-container chat-container--active' : 'chat-container'}
			onClick={() => chatStore.setData(currentChat)}>
			<img
				className={
					userStatus === 'offline'
						? 'chat-avatar'
						: 'chat-avatar  user-online-circle-shadow'
				}
				src={user.avatarURL ? user.avatarURL :
					isAnonymous ? teacherAvatar : defaultAvatar}
				alt="avatar"
			/>
			<div className="chat-info">
				<h2>{user?.name}</h2>
				<p>{isMentor || isAnonymous ? "mentor" : user?.group}</p>
			</div>
			<div className="chat-unseenCounter">
				<Counter num={counter} />
			</div>
		</div>
	);
};

export default inject(({ auth, usersStore, chatsStore, chatStore, mentorsStore, progressStore }) => {
	return { auth, usersStore, chatsStore, chatStore, mentorsStore, progressStore };
})(observer(Chat));
