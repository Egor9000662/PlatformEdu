import React, { useEffect, useState } from 'react';
import { inject, observer } from "mobx-react";
import './SendPractice.scss';
import chatIcon from '../../assets/controls/chat_img.svg';
import { Link, useLocation, useParams } from 'react-router-dom';
import iconAdd from '../../../common/assets/controls/chat/add-button.svg';
import iconCancel from '../../../common/assets/controls/chat/cancel-file.svg';
import CheckValidLink from '../../../common/components/CheckValidLink/CheckValidLink';
import { formatDateMonthYear } from "../../../modules/format-date";
import AddingHomeworkToQueue from "../../../common/AppLogic/common/AddingHomeworkToQueue";
import checkHomeworkSubmission from "./checkHomeworkSubmission";

function SendPractice({
	task,
	lesson,
	progress,
	uploudFileURL,
	deadlineOverdue,
	setProgressVisible,
	setIsSoftSkillsProgressVisible,
	setIsErrorModalVisible,
	student,
	addHomeworkToQueue,
	chatsStore,
	usersStore,
}) {
	const [inputLink, setInputLink] = React.useState('');
	const [inputMessage, setInputMessage] = React.useState('');
	const [uploadedFilesURL, setUploadedFilesURL] = useState([]);
	const [errShown, setErrShown] = React.useState(false);
	const [invalidLink, setInvalidLink] = useState(false);
	const [taskSent, setTaskSent] = useState(false);

	const location = useLocation();
	const correctedCourse = student.course.replace(/[0-9, -]/g, '');
	const { id: weekId } = useParams();
	useEffect(() => {
		checkHomeworkSubmission(progress, task.id, setTaskSent, task.type, weekId);
	}, []);

	function handleInputLink(event) {
		setInputLink(event.target.value);
		setErrShown(false);
	}

	function handleInputMessage(event) {
		setInputMessage(event.target.value);
		setErrShown(false);
	}

	const handleUploadFile = async (e) => {
		if (!e.target.files || e.target.files.length === 0) {
			setUploadedFilesURL();
			return;
		}
		let filesURL = [];
		for (let file of e.target.files) {
			filesURL.push(await uploudFileURL(file));
		}
		setUploadedFilesURL(
			uploadedFilesURL ? uploadedFilesURL.concat(filesURL) : filesURL
		);
	};

	const handleCancelFiles = (fileIndex) => {
		setUploadedFilesURL(
			uploadedFilesURL.filter((el, index) => index !== fileIndex)
		);
	};
	const homeworkObj = {
		course: correctedCourse,
		weekNumber: lesson.id.toString().split('-')[1],
		// weekNumber: lesson.weekNumber,
		block: lesson.block,
		taskName: task.name,
		taskId: task.id,
		groupId: student.group,
		uid: student.uid,
		date: formatDateMonthYear(new Date),
	}
	const practiceObj = {
		uid: student.uid,
		weekNumber: lesson.id.toString().split('-')[1],
		// weekNumber: lesson.weekNumber,
		taskName: task.name,
		taskId: task.id,
		link: inputLink,
		message: inputMessage,
		filesLinks: uploadedFilesURL,
		deadlineOverdue,
		taskBlock: lesson.block,
	}

	const chatMessageObj = {
		text: inputMessage,
		link: inputLink,
		files: uploadedFilesURL,
		role: 'student',
		sender: student.uid,
		type: 'practice',
		lessonNumber: lesson.id.toString().split('-')[1],
		// lessonNumber: lesson.weekNumber,
		taskName: task.name,
		taskId: task.id,
		taskBlock: lesson.block,
	}

	async function sendPracticeClick() {
		setIsErrorModalVisible(false);
		if (inputLink === '' || inputMessage === '' || invalidLink) {
			setErrShown(true);
			if (invalidLink) setInputLink('');
		} else {
			if (!addHomeworkToQueue.isValidHomeworkParameters(homeworkObj)) {
				setIsErrorModalVisible(true);
			} else {
				const isSent = await addHomeworkToQueue.send(homeworkObj, practiceObj, student, task.type);
				if (!isSent) {
					setIsErrorModalVisible(true);
					return;
				}
				if (task.type === 'soft-skills') {
					setIsSoftSkillsProgressVisible(true);
				}
				if (task.type === 'practice') {
					const anonymousUser = usersStore.getAnonymousUser();
					const currentChat = await chatsStore.getAnonymousChatById([student.uid, anonymousUser.uid]);
					currentChat.sendMessage(chatMessageObj);
					setProgressVisible(true);
				}
				setInputLink('');
				setInputMessage('');
				setUploadedFilesURL([]);
				setTaskSent(true);
				//функция отправки на почту скрыта, чтобы не тратить тарифные ограничения
				// sendPracticeEmail(course, group, name, taskName, weekNumber);
			}
		}
	}
	const handleChat = () => {
		localStorage.setItem('pathName', location.pathname);
	};
	return (
		<div className="sp-container">
			<div className="sendPracticeWrapper">
				<div className="sp-title">
					<p>Сдать домашнее задание на проверку </p>
					<span className="sp-taskName">{task.name} </span>
				</div>
				<div className="sendPractice-controls">
					{taskSent
						? <div className="sendPractice-controls">
							<div className="sp-notice">
								Задание отправлено!
							</div>
							{task.type === 'practice'
								? <Link
									to={{
										pathname: `/chat/${student.uid}/${task.id}`,
									}}
									onClick={handleChat}
								>
									<div className="sp-chatIcon">
										<img
											src={chatIcon}
											alt="chatIcon"
											className="sp-chatImg"
										/>
									</div>
								</Link>
								: <p>Молодец! Ты заработала кристалл.</p>
							}
						</div>
						: <div className="sendPractice-controls">
							<div className="sp-fields">
								<input
									type="text"
									className="sp-input"
									placeholder="Введите ссылку"
									onChange={handleInputLink}
									value={inputLink}
								/>
								<CheckValidLink
									link={inputLink}
									setInvalidLink={setInvalidLink}
									invalidLink={invalidLink}
								/>
								<div className="sp-container-with-add-file">
									<textarea
										rows="3"
										type="text"
										className="sp-input sp-textarea"
										placeholder="Введите сообщение"
										onChange={handleInputMessage}
										value={inputMessage}
									/>
									<label
										htmlFor={task.name}
										className="add-file-sendPractice"
										src={iconAdd}
									>
										<img src={iconAdd} alt="add-img" />
									</label>
									<input
										type="file"
										className="hidden_download-file"
										src={iconAdd}
										accept=".jpg, .jpeg, .png, .svg"
										onChange={handleUploadFile}
										multiple
										name={task.name}
										id={task.name}
									></input>
								</div>
								<div className="container-preview-files">
									{uploadedFilesURL &&
										uploadedFilesURL.map((el, id) => {
											return (
												<div className="preview-files" key={el}>
													<img
														className="preview-files_img"
														src={el}
														alt="file"
													/>
													<button
														className="preview-files_button-cancel"
														onClick={() =>
															handleCancelFiles(id)
														}
													>
														<img src={iconCancel} />
													</button>
												</div>
											);
										})}
								</div>
								<span
									className={
										errShown ? 'errMessage' : 'errMessage sp-hidden'
									}
								>
									Пожалуйста заполни поля
								</span>
							</div>
							<button
								type="button"
								className={
									taskSent
										? 'sendPractice-btn sp-hidden'
										: 'sendPractice-btn'
								}
								onClick={sendPracticeClick}
							>
								Отправить
							</button>
						</div>
					}
				</div>
			</div>
		</div>
	);
}
export default inject(({ hometaskChatStore, progressStore, homeworksStore, chatsStore, usersStore }) => {
	const addHomeworkToQueue = new AddingHomeworkToQueue(hometaskChatStore, progressStore, homeworksStore);
	useEffect(() => {
		chatsStore.loadData();
		usersStore.loadData();
	}, []);
	return { addHomeworkToQueue, chatsStore, usersStore }
})(observer(SendPractice));
