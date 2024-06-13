import React, { useEffect, useState } from "react";
import { inject, observer } from 'mobx-react';
import './MessengerWindow.scss';
import MessageInput from "./MessageInput";
import Message from "./Message";

const MessengerWindow = ({ chatStore, usersStore, uid, role, sidebarHidden }) => {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		setMessages(chatStore.getSortedMessages());
	}, [chatStore.messages])

	const recipientUid = chatStore.users.filter((user) => user !== uid);
	const recipientsData = recipientUid.map((user) => usersStore.getUser(user));
	const recipients = recipientsData.map((user) => user.name).join(', ');

	return (
		<div className={sidebarHidden ? "messengerWindow-container" : "messengerWindow-container hidden-block"}>
			{sidebarHidden &&
				<div className="messengerWindow-header">
					<h2 className="messengerWindow-header-title">{recipients}</h2>
				</div>}
			{chatStore.uid !== null ? (
				<div className="messengerWindow-innerContainer">
					{messages?.length > 0 ? (
						<div className="messengerWindow-messages">
							{messages
								.map((m) => (
									<Message
										key={m.messageId}
										message={m}
										isSender={m.sender === uid}
										editMessage={chatStore.editMessage}
										deleteMessage={chatStore.deleteMessage}
									/>
								))}
						</div>) : (
						<div className="messengerWindow-noChat">
							<h2 className="messages-none-text">
								{" "}
								Здесь пока ничего нет...
							</h2>
							<h3 className="messages-none-text">
								Отправьте сообщение, чтобы начать чат
							</h3>
						</div>
					)}
					{!chatStore.isAnonymous && < MessageInput
						role={role} />}
				</div>
			) : (
				<div className="messengerWindow-innerContainer">
					<div className="messengerWindow-noChat">
						<h2 className="messages-none-text">
							{" "}
							Выберите чат
						</h2>
					</div>
				</div>
			)}
		</div>
	);
};

export default inject(({ chatStore, usersStore }) => {
	useEffect(() => {
		chatStore.loadData()
		usersStore.loadData()
	}, [chatStore])
	return { chatStore, usersStore };
})(observer(MessengerWindow));
