import { inject, observer } from 'mobx-react';
import React, { useEffect } from 'react';
import './OverdueModal.scss';

function OverdueModal({ users }) {
	return (
		<div className="om-body">
			<h2 className="om-header">Внимание!</h2>
			<div className="om-text">
				У следующих студентов не проверено вовремя домашнее задание:
			</div>
			<div className="om-list">
				<li>
					{users.map((tasksInfo) => (
						<ul key={`${tasksInfo.uid} - ${tasksInfo.taskId}`}>
							{tasksInfo.student} ({tasksInfo.group}) -{' '}
							{tasksInfo.title} (Неделя {tasksInfo.lesson})
						</ul>
					))}{' '}
				</li>
			</div>
		</div>
	);
}

export default inject(({ usersStore }) => {
	const { users, getSentTasksInfo } = usersStore;

	useEffect(() => {
		for (let user of users) {
			for (let group of user.groups) {
				getSentTasksInfo(user.uid, user.name, group.groupId, group.course, true);
			}
		}
	}, []);
})(observer(OverdueModal));
