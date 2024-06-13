import React, { useState, useRef } from 'react';
import { inject, observer } from "mobx-react";
import { Modal } from "antd";
import iconCancel from '../../../common/assets/controls/chat/cancel-file.svg';
import './DragDropFile.scss';
import { v4 as uuidv4 } from 'uuid';

const DragDropFile = ({ callToAction, name, setState, state, accept, disabled, files }) => {
    const [dragActive, setDragActive] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef(null);

    const setFiles = (filesURL) => {
        if (!filesURL || filesURL.length === 0) {
            return;
        }

        setState({
            ...state,
            [name]: state[name] ? state[name].concat(filesURL) : filesURL
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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            let filesURL = [];
            for (let file of e.dataTransfer.files) {
                const regEx = /^[\w+\.]+$/;
                if (file.type !== "text/html") {
                    setErrorMessage("Загружаемый файл должен быть формата .html");
                    setModalVisible(true);
                    return;
                }
                if (regEx.test(file.name) === false) {
                    setErrorMessage("Имя файла должно содержать только латинские буквы и цифры");
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
        if (e.target.files && e.target.files.length > 0) {
            let filesURL = [];
            for (let file of e.target.files) {
                const regEx = /^[\w+\.]+$/;
                if (regEx.test(file.name) === false) {
                    setErrorMessage("Имя файла должно содержать только латинские буквы и цифры");
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
        e.stopPropagation();
        inputRef.current.click();
    };

    const handleCancelFiles = (fileIndex) => {
        setState({
            ...state,
            [name]: state[name].filter((el, index) => index !== fileIndex)
        });
        inputRef.current.value = '';
    };

    return (
        <div id="form-file-upload" className="file-upload" onDragEnter={handleDrag} >
            <input id="input-file-upload"
                ref={inputRef}
                type="file"
                className="input-file-upload"
                multiple={true}
                accept={accept}
                onChange={handleChange}
                name={name}
                disabled={disabled || false}
            />
            <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                <div>
                    {(!state[name] || state[name].length === 0) && <p>{callToAction}</p>}
                    <button className="upload-button"
                        onClick={(e) => onButtonClick(e)}
                    >Загрузить</button>
                </div>
            </label>
            {dragActive && <div className="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
            <div className="container-preview-files">
                {state[name] &&
                    state[name].map((el, id) => {
                        return (
                            <div className="preview-files" key={uuidv4()}>
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
                className="groupModal  group-removeModal"
                title={'Некорректный файл!'}
                open={isModalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <div>
                    {errorMessage}
                </div>
            </Modal>
        </div>
    );
};

export default inject(({ files }) => {
    return { files };
})(observer(DragDropFile));
