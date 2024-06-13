import React, { useState, useRef, useEffect } from 'react';
import iconSend from '../../../common/assets/controls/chat/send-button.svg';
import iconAdd from '../../../common/assets/controls/chat/add-button.svg';
import iconCancel from '../../../common/assets/controls/chat/cancel-file.svg';
import { inject, observer } from 'mobx-react';
import { Modal } from 'antd';

function HomeworkChatForm({
	role,
	weekNumber,
	taskId,
	files,
	hometaskChatStore,
}) {
	const [value, setValue] = useState({
		from: role,
		sender: true,
		allText: '',
		link: '',
		text: '',
		key: '',
		img: [],
	});
	const [messageText, setMessageText] = useState('');
	const textareaRef = useRef(null);
	const [uploadedFilesURL, setUploadedFilesURL] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);

	useEffect(() => {
		textareaRef.current.style.height = '0px';
		const { scrollHeight } = textareaRef.current;
		textareaRef.current.style.height = `${scrollHeight}px`;
	}, [value]);

	useEffect(() => {
		if (!uploadedFilesURL) {
			setUploadedFilesURL();
			return;
		}
		setValue({ ...value, img: uploadedFilesURL });
	}, [uploadedFilesURL]);

	const handleChange = (e) => {
		const urlRegex = /((?:https?:|www\.)[^\s]+)/g;
		const allText = e.target.value;
		let msgLink = allText.match(urlRegex);
		if (msgLink) {
			msgLink = msgLink.toString();
		}
		const msgText = allText.replace(urlRegex, '');
		const allTextFormated = allText.split(/\s+/).join('');
		setValue({
			...value,
			allText: allTextFormated,
			text: msgText,
			link: msgLink,
			key: Math.random(),
		});
		setMessageText(allText);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (value.allText !== '' || value.img.length > 0) {
			const res = await hometaskChatStore.addMessage(value);
			if (!res) {
				setIsModalVisible(true);
				return;
			}
			if (role === 'student') {
				hometaskChatStore.setUnseenWeekly(weekNumber, taskId);
			}
		}
		clearChatStates();
	};

	const onEnterPress = async (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			if (value.allText !== '' || value.img.length > 0) {
				const res = await hometaskChatStore.addMessage(value);
				if (!res) {
					setIsModalVisible(true);
					return;
				}
				if (role === 'student') {
					hometaskChatStore.setUnseenWeekly(weekNumber, taskId);
				}
			}
			clearChatStates();
			e.preventDefault();
		}
	};

	function clearChatStates() {
		setValue({ ...value, allText: '', link: '', text: '', img: [] });
		setMessageText('');
		setUploadedFilesURL();
	}

	const handleUploadFile = async (e) => {
		if (!e.target.files || e.target.files.length === 0) {
			setPreviewFiles();
			return;
		}
		let filesURL = [];
		for (let file of e.target.files) {
			filesURL.push(await files.uploudFileURL(file));
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

	const pasteImg = async (event) => {
		const clipboardItems = event.clipboardData.items;
		const items = [].slice.call(clipboardItems).filter(function (item) {
			return /^image\//.test(item.type);
		});
		if (items.length === 0) {
			return;
		}

		const item = items[0];
		const blob = item.getAsFile();
		let file = new File([blob], "file name", { type: blob.type, lastModified: new Date().getTime() }, 'utf-8');

		let filesURL = [];
		filesURL.push(await files.uploudFileURL(file));
		setUploadedFilesURL(
			uploadedFilesURL ? uploadedFilesURL.concat(filesURL) : filesURL
		);
	}

	return (
		<div>
			<form className="homework-form" onSubmit={handleSubmit}>
				<textarea
					ref={textareaRef}
					type="text"
					value={messageText}
					onChange={handleChange}
					onKeyDown={onEnterPress}
					onPaste={(e) => pasteImg(e)}
					placeholder="Сообщение..."
					name="message"
					className="homework-form-input"
				/>
				<label htmlFor="files" className="add-file" src={iconAdd}>
					<img src={iconAdd} alt="add-img" />
				</label>
				<input
					type="file"
					className="hidden_download-file"
					src={iconAdd}
					accept=".jpg, .jpeg, .png, .svg, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
					onChange={handleUploadFile}
					multiple
					name="files"
					id="files"
				></input>
				<button type="submit" className="send-button">
					<img className="send-icon" src={iconSend} alt="send" />
				</button>
			</form>
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
									onClick={() => handleCancelFiles(id)}
								>
									<img src={iconCancel} />
								</button>
							</div>
						);
					})}
			</div>
			<Modal
				open={isModalVisible}
				onOk={() => setIsModalVisible(false)}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				className="signup-modal"
			>
				<p>Ошибка отправки сообщения. Попробуйте еще раз.</p>
			</Modal>
		</div>
	);
}

export default inject(({ hometaskChatStore, files }) => {
	return {
		files,
		hometaskChatStore,
	};
})(observer(HomeworkChatForm));
