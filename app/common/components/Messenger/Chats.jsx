import React, { useEffect, useState } from "react";
import { inject, observer } from 'mobx-react';
import Chat from "./Chat";
import { filterUsers, usersFilteredByGroup } from './MessengerController';
import { v4 } from "uuid";

const Chats = ({ username, usersStore, auth, chatsStore, mentorsStore, groupsStore, setSidebarHidden }) => {
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);

	useEffect(() => {
		setUsersAsync();
	}, []);

	useEffect(() => {
		setUsersAsync();
	}, [usersStore.users, auth.profile.group]);

	useEffect(() => {
		setFilteredUsers(users.filter((user) => filterUsers(user, username, auth)));
	}, [username, users]);

	const setUsersAsync = async () => {
		setUsers(await usersFilteredByGroup(usersStore.users, auth, mentorsStore.getMentor,
			groupsStore.getGroup, chatsStore.getChatByIds, chatsStore.getAnonymousChatById));
	};

	return (
		<div className="chats">
			<div className="messenger-chatList">
				{filteredUsers && filteredUsers
					?.map((user) => (
						<div className="messengerUserContainer" key={v4()} onClick={() => setSidebarHidden(true)}>
							<Chat
								chat={user.name}
								uid={user.uid}
								course={user.course}
							/>
						</div>
					))}
			</div>
		</div>
	);
};

export default inject(({ auth, usersStore, chatsStore, mentorsStore, groupsStore }) => {
	useEffect(() => {
		usersStore.loadData();
		chatsStore.loadData();
		mentorsStore.loadData();
		groupsStore.loadData();
	}, []);
	return { auth, usersStore, chatsStore, mentorsStore, groupsStore };
})(observer(Chats));
