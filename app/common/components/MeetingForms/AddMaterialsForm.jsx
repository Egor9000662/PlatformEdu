import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import '../../pages/GroupMeeting/GroupMeeting.scss';
import '../../../admin/components/StudentsList/StudentsList.scss';
import '../../../admin/components/Student/Student.scss';
import CheckValidLink from '../CheckValidLink/CheckValidLink';
import iconAdd from '../../assets/controls/chat/add-button.svg';
import iconCancel from '../../../common/assets/controls/chat/cancel-file.svg';
import selectCheckmark from '../../assets/controls/select_checkmark.svg';
import { v4 } from 'uuid';

export default function AddMaterialsForm({
    isModalMoveVisible,
    setIsModalMoveVisible,
    groupMeetingModel,
    meetingId,
    currentGroup,
}) {
    const [inputTheme, setInputTheme] = useState('');
    const [inputLink, setInputLink] = useState('');
    const [invalidVideoLink, setInvalidVideoLink] = useState(false);
    const [uploadedFilesURL, setUploadedFilesURL] = useState([]);
    const [links, setLinks] = useState('');
    const [invalidLinks, setInvalidLinks] = useState('');
    const [chosenGroupSchedule, setChosenGroupSchedule] = useState([]);
    const [selectWeekValue, setSelectWeekValue] = useState('');
    const [isErr, setIsErr] = useState(false);

    useEffect(() => {
        const groupSchedule = groupMeetingModel.getGroupSchedule(currentGroup);
        setChosenGroupSchedule(groupSchedule);
    }, [currentGroup]);

    const handleUploadFile = async (e) => {
        const filesURL = await groupMeetingModel.uploadFiles(e);
        setUploadedFilesURL(
            uploadedFilesURL ? uploadedFilesURL.concat(filesURL) : filesURL
        );
    };

    const handleCancelFiles = (fileIndex, event) => {
        event.preventDefault();
        setUploadedFilesURL(
            uploadedFilesURL.filter((el, index) => index !== fileIndex)
        );
    };

    async function handleAddVideo() {
        const isVideoAdded = await groupMeetingModel.addVideo(
            invalidVideoLink,
            invalidLinks,
            inputLink,
            inputTheme,
            selectWeekValue,
            currentGroup,
            uploadedFilesURL,
            links,
            meetingId,
        )
        if (isVideoAdded) {
            setInputTheme('');
            setInputLink('');
            setSelectWeekValue('');
            setUploadedFilesURL([]);
            setIsModalMoveVisible(false);
            setIsErr(false);
        } else {
            setIsErr(true);
            setInputLink('');
        }
    }

    return (
        <Modal
            className="stdModal std-moveModal"
            title="Видео"
            open={isModalMoveVisible}
            onOk={() => setIsModalMoveVisible(false)}
            onCancel={() => setIsModalMoveVisible(false)}
            footer={[
                <Button
                    key="back"
                    onClick={() => setIsModalMoveVisible(false)}
                    className="redBtn"
                >
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleAddVideo}
                    className="greenBtn"
                >
                    Ок
                </Button>,
            ]}
        >
            <input
                type="text"
                onChange={(e) => setInputTheme(e.target.value)}
                value={inputTheme}
                className="input-video"
                placeholder="Тема встречи"
            />
            <input
                type="text"
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                className="input-video"
                placeholder="Ссылка на видео"
            />
            <CheckValidLink
                link={inputLink}
                setInvalidLink={setInvalidVideoLink}
                invalidLink={invalidVideoLink}
            />
            <label htmlFor="files" className="upload-files-label" src={iconAdd}>
                <p className='upload-files-text'>Материалы встречи</p>
                <div className="container-preview-files">
                    {uploadedFilesURL &&
                        uploadedFilesURL.map((el, id) => {
                            return (
                                <div className="preview-files" key={v4()}>
                                    <img
                                        className="preview-files_img"
                                        src={el?.url}
                                        alt="file"
                                    />
                                    <button
                                        className="preview-files_button-cancel materials-button-cancel"
                                        onClick={(e) => handleCancelFiles(id, e)}
                                    >
                                        <img src={iconCancel} alt={el?.name} />
                                    </button>
                                </div>
                            );
                        })}
                </div>
                <img src={iconAdd} alt="add-files" className='upload-files-img' />
            </label>
            <input
                type="file"
                className="upload-files"
                src={iconAdd}
                accept=".jpg, .jpeg, .png, .svg, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
                onChange={handleUploadFile}
                multiple
                name="files"
                id="files"
            ></input>
            <input
                type="text"
                onChange={(e) => setLinks(e.target.value)}
                value={links}
                className="input-video"
                placeholder="Ссылки"
            />
            <CheckValidLink
                link={links}
                setInvalidLink={setInvalidLinks}
                invalidLink={invalidLinks}
            />
            <div className="stdMove-selectContainer">
                <select
                    name="week"
                    id="weekSelect"
                    value={selectWeekValue}
                    onChange={(e) => setSelectWeekValue(e.target.value)}
                    className="stdMove-select"
                >
                    <option value="" defaultValue>
                        Выберите неделю
                    </option>
                    {chosenGroupSchedule?.map((week) => {
                        return (
                            <option key={week.id} value={week.id}>
                                {week.id}
                            </option>
                        );
                    })}{' '}
                </select>
                <img
                    src={selectCheckmark}
                    className="stdMove-checkMark"
                />
            </div>
            {isErr && (
                <span className="video-err-message">
                    Вы заполнили не все поля
                </span>
            )
            }
        </Modal>
    );
}
