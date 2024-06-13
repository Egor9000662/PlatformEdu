import React, { useState, useRef, useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { Modal } from "antd";
import iconCancel from '../../../common/assets/controls/chat/cancel-file.svg';
import './DragDropFile.scss';

const DragDropFile = ({ callToAction, files, setSchool, school }) => {
    const [dragActive, setDragActive] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const inputRef = useRef(null);

    const setFiles = (filesURL) => {
        if (!filesURL || filesURL.length === 0) {
            return;
        }
        setSchool({
            ...school,
            logo: school.logo ? school.logo.concat(filesURL) : filesURL,
        });
    }

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            let filesURL = [];
            for (let file of e.dataTransfer.files) {
                const regEx = /^[\w+\.]+$/;
                if (regEx.test(file.name) === false) {
                    setModalVisible(true);
                    return;
                }
                filesURL.push(await files.uploudFileURL(file));
            }
            setFiles(filesURL);
        }
    };

    const handleChange = async (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            let filesURL = [];
            for (let file of e.target.files) {
                const regEx = /^[\w+\.]+$/;
                if (regEx.test(file.name) === false) {
                    setModalVisible(true);
                    return;
                }
                filesURL.push(await files.uploudFileURL(file));
            }
            setFiles(filesURL);
        }
    };

    const onButtonClick = (e) => {
        e.preventDefault();
        inputRef.current.click();
    };

    const handleCancelFiles = (fileIndex) => {
        setSchool(
            school.logo.filter((el, index) => index !== fileIndex)
        );
    };

    return (
        <div id="form-file-upload" className="file-upload" onDragEnter={handleDrag} >
            <input id="input-file-upload"
                ref={inputRef}
                type="file"
                className="input-file-upload"
                multiple accept=".jpg, .jpeg, .png, .svg"
                onChange={handleChange}
            />
            <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                <div>
                    {!school.logo && <p>{callToAction}</p>}
                    <button className="upload-button" onClick={onButtonClick}>Загрузить</button>
                </div>
            </label>
            {dragActive && <div className="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
            <div className="container-preview-files">
                {school.logo &&
                    <div className="preview-files">
                        <img
                            className="preview-files_img"
                            src={school.logo}
                            alt="file"
                        />
                        <button
                            className="preview-files_button-cancel"
                            onClick={() => handleCancelFiles(id)}
                        >
                            <img src={iconCancel} />
                        </button>
                    </div>
                }
            </div>
            <Modal
                className="groupModal  group-removeModal"
                title={'Некорректный файл!'}
                open={isModalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <div>
                    Имя файла должно содержать только латинские буквы и цифры
                </div>
            </Modal>
        </div>
    );
};

export default inject(({ files }) => {
    return { files };
})(observer(DragDropFile));