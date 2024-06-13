import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import seenIcon from '../../../common/assets/controls/chat/seen-icon.svg';
import iconEdit from '../../../common/assets/controls/icon-edit.svg';
import iconDelete from '../../../common/assets/controls/icon-delete.svg';
import { formatTime } from '../../../modules/format-date';
import chat from '../../../teacher/assets/vector_chat.png';
import './Message.scss';

const MessageContent = ({ message }) => {
    const isPractice = message.type === 'practice';
    return (
        isPractice ? (
            <div className="chat-practice">
                <h1 className="chat-practice-title">Урок {message.lessonNumber}: {message.taskName} </h1>
                <p className="chat-text">{message.text}</p>
                <a href={message.link}>{message.link}</a>
            </div>
        ) : (
            <div>
                <p className="chat-text">{message.text}</p>
            </div>
        )
    );
}

function Message({
    message,
    isSender,
    editMessage,
    deleteMessage,
    progressStore,
}) {
    const [isModalFile, setIsModalFile] = useState(false);
    const [currentImg, setCurrentImg] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [editedText, setEditedText] = useState(message.text);
    const [editedLink, setEditedLink] = useState(message.link);
    const [counter, setCounter] = useState(0);

    const timeMessage = formatTime(message.timeSent);
    const isPractice = message.type === 'practice';
    const location = useLocation();

    const setMessagesCounter = async () => {
        const unseenMessages = await progressStore.getTaskUnseenMessages(message.sender, message.taskId);
        setCounter(unseenMessages);
    }

    useEffect(() => {
        if (!isPractice) {
            return;
        }
        setMessagesCounter();
    }, []);

    const showDownloadFileModalForm = (imgLink) => {
        setCurrentImg(imgLink);
        setIsModalFile(true);
    };
    const cancelDownloadFileModalForm = () => {
        setIsModalFile(false);
    };

    const handleEdit = () => {
        editMessage(message.messageId, editedText, editedLink);
        setIsEditable(false);
    };

    const chatState = {
        weekNumber: `${message.lessonNumber}`,
        themeName: `${message.taskName}`,
        block: `${message.taskBlock}`,
    };
    const handleChat = () => {
        localStorage.setItem('pathName', location.pathname);
        localStorage.setItem('state', JSON.stringify(chatState));
    };

    return (
        <div
            className={`chat-message ${isSender ? 'sender' : 'recipient'
                }`}
        >
            <div className="chat-message__text-container">
                <div className="chat-message__text">
                    {isEditable ? (
                        <div>
                            <div className="message__inputs">
                                <textarea
                                    className='edit-input messageInput-input'
                                    type="text"
                                    onChange={(event) => setEditedText(event.target.value)}
                                    value={editedText}
                                ></textarea>
                                {message.link && <input
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
                    ) : (
                        <div>
                            <MessageContent
                                message={message}
                            />
                        </div>)}
                    {message.files &&
                        Object.values(message.files).map((imgLink) => {
                            return (
                                <div key={imgLink}>
                                    <div
                                        className="chat-message-files"
                                        onClick={() =>
                                            showDownloadFileModalForm(imgLink)
                                        }
                                    >
                                        <img src={imgLink} alt="chatImg" />
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

                    <div className="message__side-container">
                        {isPractice ? (
                            <div>
                                <span >
                                    <img
                                        className="chat-icon"
                                        src={chat}
                                        alt="chat"
                                    />
                                    <span className="message-time">
                                        {counter}
                                    </span>
                                </span>
                            </div>
                        ) : (
                            <div>
                                <span className="message-icons">
                                    {message.text && isSender && (
                                        <img
                                            src={iconEdit}
                                            className="edit-icon"
                                            alt="edit"
                                            onClick={() => setIsEditable(true)}
                                        />
                                    )}
                                </span>
                                <span className="message-icons">
                                    {isSender && (
                                        <img
                                            src={iconDelete}
                                            className="delete-icon"
                                            alt="delete"
                                            onClick={() => deleteMessage(message.messageId)}
                                        />
                                    )}
                                </span>
                            </div>
                        )}
                        <div>
                            <span className="message-time">
                                {timeMessage}
                            </span>
                            <span className="message-seen">
                                {message.seen && (
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
            {
                isPractice &&
                <Button
                    type="primary"
                    className="greenBtn discussion-btn"
                >
                    <Link
                        to={{
                            pathname: `/chat/${message.sender}/${message.taskId}`,
                            state: chatState,
                        }}
                        onClick={handleChat}
                    >
                        <div>
                            Перейти к обсуждению
                        </div>
                    </Link>
                </Button>
            }
        </div >
    );
}
export default inject(({ progressStore }) => {
    return { progressStore };
})(observer(Message));
