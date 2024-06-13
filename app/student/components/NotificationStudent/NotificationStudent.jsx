import React, {useEffect, useState} from 'react';
import teacher from '../../../common/assets/defaultAvatars/cat-avatar.svg';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import BodyNoticeMessage from "./BodyNoticeMessage";
import BodyNoticeAchievementMessage from "./BodyNoticeAchievementMessage";
import './NotificationStudent.scss';


function NotificationStudent(props) {
	const {
		topic,
		date,
		notice,
		text,
		urgency,
		taskId,
		lessonNumber,
		uid,
		nid,
		setNotifSeen,
		progressStore,
		sender,
	} = props;
	const [homeworkStatus, setHomeworkStatus] = useState('')
	const dateNotif = new Date(date).toLocaleDateString();
	const notifState = { lessonNumber: lessonNumber, themeName: notice };
	const handleNotif = () => {
		localStorage.setItem('pathName', '/notification');
		localStorage.setItem('state', JSON.stringify(notifState));
		setNotifSeen(uid, nid);
	};
	useEffect(()=>{
		getTaskHomeworkStatus();
	}, [taskId]);

	function getTaskHomeworkStatus () {
		return progressStore.getTaskProgress(uid, 'practice', taskId)
			.then((res) => setHomeworkStatus(res.homeworkStatus));
	}

	return (
		<div className={`wrapper__notification urgency-${urgency}`}>
			<div className="importantNotice">
				<img src={teacher} alt="ava" className="icon__notification"/>
				<div className="title__notice">{sender}</div>
				<div className="box__topic">
					<div className="title__topic">{topic}</div>
					<div className="date__topic">{dateNotif}</div>
				</div>
			</div>
			{homeworkStatus !== 'accepted'
				? <BodyNoticeMessage
					notice={notice}
					text={text}
					urgency={urgency}
					uid={uid}
					taskId={taskId}
					state={notifState}
					handleNotif={handleNotif}
				/>
				: <BodyNoticeAchievementMessage
					notice={notice}
					text={text}
					urgency={urgency}
					uid={uid}
					taskId={taskId}
					state={notifState}
					handleNotif={handleNotif}
				/>
			}
		</div>
	);
}

export default inject(({ auth, oneUserStore, progressStore }) => {
	const { profile } = auth;
	const { setNotifSeen } = oneUserStore;
	const uid = profile?.uid;
	return {
		uid,
		setNotifSeen,
		progressStore,
	};
})(observer(NotificationStudent));
