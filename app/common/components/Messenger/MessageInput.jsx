import React, { useState, useRef, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import './MessageInput.scss';
import iconSend from '../../../common/assets/controls/chat/send-button.svg';
import iconAdd from '../../../common/assets/controls/chat/add-button.svg';
import iconCancel from '../../../common/assets/controls/chat/cancel-file.svg';

const MessageInput = ({ auth, chatStore, files, role }) => {
    const [messageObj, setMessageObj] = useState({
        sender: auth.user.uid,
        role: auth.role,
        text: '',
        files: [],
    });
    const [messageText, setMessageText] = useState('');
    const [uploadedFilesURL, setUploadedFilesURL] = useState([]);
    const textareaRef = useRef(null);

    useEffect(() => {
        textareaRef.current.style.height = '0px';
        const { scrollHeight } = textareaRef.current;
        textareaRef.current.style.height = `${scrollHeight}px`;
    }, [messageText]);

    useEffect(() => {
        if (!uploadedFilesURL) {
            setUploadedFilesURL();
            return;
        }
        setMessageObj({ ...messageObj, files: uploadedFilesURL });
    }, [uploadedFilesURL]);

    const clearChatStates = () => {
        setMessageObj({ ...messageObj, text: '', files: [] });
        setMessageText('');
        setUploadedFilesURL();
    }

    const handleMessage = (text) => {
        setMessageText(text);
        setMessageObj({
            ...messageObj,
            text: text
        })
    }

    const handleUploadFile = async (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        const filesURL = await files.getUploadFilesURLs(e.target.files);
        setUploadedFilesURL(
            uploadedFilesURL ? uploadedFilesURL.concat(filesURL) : filesURL
        );
    };

    const handleCancelFiles = (fileIndex) => {
        setUploadedFilesURL(
            uploadedFilesURL.filter((el, index) => index !== fileIndex)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessageObj({ ...messageObj, text: messageText, files: uploadedFilesURL });
        chatStore.sendMessage(messageObj);
        clearChatStates();
    };

    const onEnterPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <div className='messageInput-container'>
            <form className="messageInput-form" onSubmit={handleSubmit}>
                <textarea
                    ref={textareaRef}
                    type="text"
                    value={messageText}
                    onChange={(e) => handleMessage(e.target.value)}
                    onKeyDown={onEnterPress}
                    placeholder="Сообщение..."
                    name="message"
                    className="messageInput-input"
                />
                <label htmlFor="files" className="add-file" src={iconAdd}>
                    <img src={iconAdd} alt="add-img" />
                </label>
                <input
                    type="file"
                    className="hidden_download-file"
                    src={iconAdd}
                    accept=".jpg, .jpeg, .png, .svg"
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
        </div>
    )
}
export default inject(({ auth, chatStore, files }) => {
    useEffect(() => {
        chatStore.loadData();
    }, [chatStore.isLoaded]);
    return { auth, chatStore, files };
})(observer(MessageInput));
