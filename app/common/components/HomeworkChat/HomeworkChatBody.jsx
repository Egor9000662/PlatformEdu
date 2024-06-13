import { inject, observer } from "mobx-react";
import React, { useEffect } from "react";
import HomeworkChatMessage from "./HomeworkChatMessage";

function HomeworkChatBody({ messages, role }) {
	return (
		<div>
			<div className="homework-messages-block">
				{messages?.length > 0 ? (
					messages.map((message) => (
						<HomeworkChatMessage
							key={message.commentId || Math.random()}
							message={message}
							role={role}
						/>
					))
				) : (
					<div className="homework-none-block">
						<div className="homework-message-none">
							<h2 className="messages-none-text">
								{" "}
								Здесь пока ничего нет...
							</h2>
							<h3 className="messages-none-text">
								Отправьте сообщение, чтобы начать чат
							</h3>
						</div>
					</div>
				)}
			</div>{" "}
		</div>
	);
}

export default inject(({ hometaskChatStore }) => {
	const { messages } = hometaskChatStore;

	return { messages };
})(observer(HomeworkChatBody));
