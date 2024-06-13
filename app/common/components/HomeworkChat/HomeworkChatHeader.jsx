import React, { useState } from 'react';
import BackArrow from '../BackArrow/BackArrow';
import teacherAvatar from '../../assets/defaultAvatars/cat-avatar.svg';
import studentDefaultAvatar from '../../assets/defaultAvatars/frontend-avatar.png';
import Enum from '../../../enum';

export default function HomeworkChatHeader({
	role,
	practice,
	// userStatus,
	stdAvatar,
	namestudent,
	hometaskChatStore,
}) {
	const studentAvatar = stdAvatar ? stdAvatar : studentDefaultAvatar;
	const avatarSrc = role === 'teacher' ? studentAvatar : teacherAvatar;
	const pathName = localStorage.getItem('pathName');
	function goBack() {
		hometaskChatStore.reset();
	}
	return (
		<div className="homework-container-header">
			<div className="chat-header-info">
				<div className="chat-back-arrow" onClick={goBack}>
					<BackArrow pathName={pathName} />
				</div>
				<div className="chat-header-text">
					<h3 className="chat-course-name">
						{role === 'teacher' ? practice.taskName : Enum.character}
					</h3>
					<p className="chat-week">Неделя {practice.week}</p>
				</div>
			</div>
			<div className="chat-header-avatar">
				{role === 'teacher' && (
					<div className="chat-name-student">{namestudent}</div>
				)}
				<img className="chat-avatar" src={avatarSrc} alt="Avatar" />
				{/*<div*/}
				{/*	className={*/}
				{/*		userStatus === 'offline'*/}
				{/*			? 'status-circle user-offline-circle'*/}
				{/*			: 'status-circle user-online-circle'*/}
				{/*	}*/}
				{/*></div>*/}
				{/*<div*/}
				{/*	className={*/}
				{/*		userStatus === 'offline'*/}
				{/*			? 'status-circle-shadow user-offline-circle-shadow'*/}
				{/*			: 'status-circle-shadow user-online-circle-shadow'*/}
				{/*	}*/}
				{/*></div>*/}
			</div>
		</div>
	);
}
