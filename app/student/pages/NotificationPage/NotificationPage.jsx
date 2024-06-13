import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import NotificationStudent from '../../components/NotificationStudent/NotificationStudent';
import DividerNotification from '../../components/DividerNotification/DividerNotification';
import './NotificationPage.scss';
import Enum from '../../../enum';

function NotificationPages({
	uid,
	oneUserStore,
}) {
	const notifKey = Date.now();
	const [notifs, setNotifs] = useState([]);
	useEffect(async () => {
		oneUserStore.getNotifs(uid).then((data) => setNotifsData(data));
	}, []);

	const setNotifsData = (data) => {
		setSecondaryNotifs(data);
		setNotifs(data);
		data.filter(
			(notif) => notif.seen === false && notif.topic !== 'Проверка ДЗ'
		).map((notif) => oneUserStore.setNotifSeen(uid, notif.nid));
	};

	const setSecondaryNotifs = (data) => {
		const now = new Date();
		data.map((notif) => {
			const diff = Math.floor(
				(new Date(now) - new Date(notif.date)) / 1000 / 3600 / 24
			);
			if (notif.urgency < 3 && diff >= 7) {
				notif.urgency = 3;
				notif.seen = true;
				oneUserStore.setNotifSecondary(uid, notif.nid);
			}
		});
	};

	const getSender = (notification) => {
		if (notification.taskId) {
			return Enum.character
		} else {
			if (notification.from === 'teacher') {
				return Enum.teacher
			}
			if (notification.from === 'admin') {
				return Enum.admin
			}
		}
	};

	return (
		<div className="notifications-container">
			<div className="body__np">
				<div className="header__np">
					<div className="title__np">Уведомления</div>
					{/*//todo добавить фильтрацию по курсам*/}
				</div>
				<div className="notification_b">
					{notifs
						.reverse()
						.filter((notification) => notification.seen === false)
						.map((notification) => (
							<NotificationStudent
								key={notifKey}
								sender={getSender(notification)}
								{...notification}
							/>
						))}
					{!notifs.length > 0 && (
						<h1 className="notification-none-message">
							Здесь пока ничего нет...
						</h1>
					)}
					{notifs.filter((notification) => notification.seen === true)
						.length > 0 && <DividerNotification />}
					{notifs
						.filter((notification) => notification.seen === true)
						.map((notification) => (
							<NotificationStudent
								key={notifKey + notification.date}
								sender={getSender(notification)}
								{...notification}
							/>
						))}
				</div>
			</div>
		</div>
	);
}

export default inject(({ auth, oneUserStore }) => {
	const { profile } = auth;
	const uid = profile?.uid;

	return {
		uid,
		oneUserStore,
	};
})(observer(NotificationPages));
