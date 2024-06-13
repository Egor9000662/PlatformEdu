import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import seenIcon from '../../../common/assets/controls/chat/seen-icon.svg';
import { formatTime } from '../../../modules/format-date';
import iconEdit from '../../../common/assets/controls/icon-edit.svg';
import iconDelete from '../../../common/assets/controls/icon-delete.svg';
import iconDoc from '../../../common/assets/controls/icon-doc.png';
import {inject, observer} from "mobx-react";

function HomeworkChatMessage({
	message,
	role,
	usersStore,
	chatsStore,
	hometaskChatStore,
}) {
	const {
		comment,
		link,
		img,
		seen,
		timeSent,
		commentId
	} = message;
	const sender = message.from;

	const [isModalFile, setIsModalFile] = useState(false);
	const [currentImg, setCurrentImg] = useState('');
	const [isEditable, setIsEditable] = useState(false);
	const [editedText, setEditedText] = useState(comment);
	const [editedLink, setEditedLink] = useState(link);

	const showDownloadFileModalForm = (imgLink) => {
		setCurrentImg(imgLink);
		setIsModalFile(true);
	};
	const cancelDownloadFileModalForm = () => {
		setIsModalFile(false);
	};

	const handleEdit = () => {
		hometaskChatStore.editMessage(commentId, editedText, editedLink, chatsStore, usersStore);
		setIsEditable(false);
	};

	let timeMessage = formatTime(timeSent);
	const isImage = (imgLink) => {
		return imgLink.includes("jpg")
			|| imgLink.includes("jpeg")
			|| imgLink.includes("png")
			|| imgLink.includes("gif")
			|| imgLink.includes("svg");
	}

	return (
		<div
			className={`homework-message ${role === sender ? 'sender' : 'recipient'
				} message-${message.markType}`}
		>
			<div className="homework-message__text-container">
				<div className="homework-message__text">
					{isEditable ? (
						<div>
							<div className='homework-message__inputs'>
								<textarea
									className='edit-input'
									type="text"
									onChange={(event) => setEditedText(event.target.value)}
									value={editedText}
								></textarea>
								{link && <input
									className='edit-input'
									type="text"
									onChange={(event) => setEditedLink(event.target.value)}
									value={editedLink}
								></input>}
							</div>
							<Button
								key="submit"
								type="primary"
								onClick={handleEdit}
								className="greenBtn"
							>
								Ок
							</Button>
							<Button
								type="primary"
								onClick={() => setIsEditable(false)}
								className="redBtn"
							>
								X
							</Button>
						</div>
					) :
						(comment)}
					{img &&
						Object.values(img).map((imgLink) => {
							return (
								<div key={imgLink}>
									<div
										className="homework-message-files"

									>
										{isImage(imgLink) ?
											(<img src={imgLink} alt="chatImg" onClick={() =>
												showDownloadFileModalForm(imgLink)
											} />) :
											(<a href={imgLink} >
												<img src={iconDoc} alt="chatFile" />
											</a>)
										}
									</div>
									<Modal
										open={
											imgLink === currentImg
												? isModalFile
												: false
										}
										onCancel={cancelDownloadFileModalForm}
										footer={null}
										width={1100}
										className="downloadFile-modal"
									>
										<img
											src={imgLink}
											alt="chatImg"
											className="downloadFile-img"
										/>
									</Modal>
								</div>
							);
						})}
					<div
						className={`homework-message__link ${role === sender ? 'sender-link' : 'recipient-link'
							} `}
					>
						<a href={link ? link : null}>{link}</a>
					</div>
					<div className="message__side-container">
						<div>
							<span className="message-icons">
								{comment && sender === role && (
									<img
										src={iconEdit}
										className="edit-icon"
										alt="edit"
										onClick={() => setIsEditable(true)}
									/>
								)}
							</span>
							<span className="message-icons">
								{sender === role && (
									<img
										src={iconDelete}
										className="delete-icon"
										alt="delete"
										onClick={() => hometaskChatStore.deleteMessage(commentId)}
									/>
								)}
							</span>
						</div>
						<span className="message-time">
							{timeMessage}
						</span>
						<span className="message-seen">
							{sender === role && seen && (
								<img
									src={seenIcon}
									className="seen-icon"
									alt="seen"
								/>
							)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
export default inject(({ usersStore, hometaskChatStore, chatsStore }) => {
	return { usersStore, hometaskChatStore, chatsStore };
})(observer(HomeworkChatMessage));
