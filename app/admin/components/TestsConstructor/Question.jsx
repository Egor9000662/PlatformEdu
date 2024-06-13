import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Button, Checkbox, Modal, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import addButton from '../../../common/assets/controls/chat/add-button.svg';
import iconDelete from '../../../common/assets/controls/icon-delete.svg';
import DragDropFile from "../DragDropFile/DragDropFile";

const Question = ({ index, currentQuestion, saveQuestion, deleteQuestion, isEdit, defaultQuestion }) => {
    const [isActive, setIsActive] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);

    const [isMultiple, setIsMultiple] = useState(false);
    const [questionTitle, setQuestionTitle] = useState('');
    const [image, setImage] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([
        {
            comment: '',
            title: '',
            isValid: false,
        },
        {
            comment: '',
            title: '',
            isValid: false,
        },
        {
            comment: '',
            title: '',
            isValid: false,
        },
        {
            comment: '',
            title: '',
            isValid: false,
        }
    ])

    const [questionTitleError, setQuestionTitleError] = useState('');
    const [optionsError, setOptionsError] = useState('');
    const [selectedOptionsError, setSelectedOptionsError] = useState('');
    const [optionTitleError, setOptionTitleError] = useState('');

    const setInitialQuestion = (question) => {
        if (question) {
            if (isEdit) {
                setDisabled(question.saved !== false);
            }
            setQuestionTitle(question.title || '');
            setImage(question.image || '');
            setIsMultiple(question.type === 'multi' ? true : false);

            if (question.options) {
                setOptions(question.options.map((item) => ({
                    comment: item.comment || '',
                    title: item.title || '',
                    isValid: item.isValid || false,
                })));
                setSelectedOptions(question.options
                    .map((item, i) => item.isValid ? i : null)
                    .filter(item => item !== null));
            } else {
                question.options = options;
            }
        }
    }

    useEffect(() => {
        setInitialQuestion(currentQuestion);
    }, [])

    const handleChangeQuestion = (e) => {
        currentQuestion.title = e.target.value
        setQuestionTitle(e.target.value)
    }

    const handleChangeImage = (image) => {
        currentQuestion.image = image
        setImage(image)
    }

    const handleChangeSwitch = (e) => {
        currentQuestion.type = e ? 'multi' : 'solo';
        setIsMultiple(e);
        setSelectedOptions([])
    }

    const handleCheckboxChange = (e, index) => {
        if (e.target.checked && !isMultiple) {
            setSelectedOptions([index]);
            currentQuestion.options[index].isValid = true;
        }
    };

    const handleCheckboxGroupChange = (options) => {
        if (isMultiple) {
            setSelectedOptions(options);
            currentQuestion.options.forEach((item, i) => {
                item.isValid = options.includes(i);
            });
        }
    };

    const handleChangeOption = (e, i) => {
        let data = [...options];
        data[i][e.target.name] = e.target.value;
        setOptions(data);
        currentQuestion.options[i][e.target.name] = e.target.value;
    }

    const deleteOption = (i) => {
        let data = [...options];
        data.splice(i, 1);
        setOptions(data);
        const selected = selectedOptions.map(item => {
            if (item === i) {
                return null;
            }
            if (item > i) {
                return item - 1;
            }
            return item;
        }
        );
        setSelectedOptions(selected);
    }

    const addOption = () => {
        setOptions([...options, { comment: '', title: '', isValid: false }]);
    }

    const clearErrors = () => {
        setQuestionTitleError('');
        setOptionsError('');
        setSelectedOptionsError('');
        setOptionTitleError('');
    }

    const handleSaveQuestion = () => {
        clearErrors();
        let hasError = false;
        if (questionTitle === '') {
            setQuestionTitleError('Введите вопрос');
            hasError = true;
        }
        if (options.length < 2) {
            setOptionsError('Добавьте варианты ответа');
            hasError = true;
        }
        if (selectedOptions.length === 0) {
            setSelectedOptionsError('Выберите хотя бы один правильный ответ');
            hasError = true;
        }
        if (selectedOptions.length > 1 && !isMultiple) {
            setSelectedOptionsError('Выберите только один правильный ответ или аереключите на вопрос с множественным выбором');
            hasError = true;
        }
        if (options.some(item => item.title === '')) {
            setOptionTitleError('Заполните все варианты ответа');
            hasError = true;
        }
        if (hasError) {
            setInfoModal(true);
        } else {
            setSaveModal(true);
            clearErrors();
            saveQuestion(index, {
                title: questionTitle,
                type: isMultiple ? 'multi' : 'solo',
                options: options.map((item, i) => {
                    return {
                        ...item,
                        isValid: selectedOptions.includes(i),
                    }
                }),
                image: image,
                saved: true,
            });
        }
    }

    const handleEditQuestion = () => {
        currentQuestion.saved = false;
        setDisabled(false);
    }

    const handleCancelEdit = () => {
        currentQuestion.saved = true;
        setInitialQuestion(defaultQuestion);
    }

    return (
        <div className="testsConstructor-accordion">
            <div className="testsConstructor-accordion-title" onClick={() => setIsActive(!isActive)}>
                <div>{`Вопрос ${index + 1}`}</div>
                <img
                    className={isActive ? "accordion-title-button rotated" : "accordion-title-button"}
                    src={addButton}
                    alt="button"
                />
            </div>

            {isActive &&
                <div className="testsConstructor-question-content">
                    <div className="question-content-block">
                        <p className="question-block-title">Введите вопрос</p>
                        <div className="question-content-group">
                            <textarea
                                type="text"
                                placeholder="Ваш вопрос"
                                value={questionTitle}
                                onChange={(e) => handleChangeQuestion(e)}
                                className="testsConstructor-input testsConstructor-textarea"
                                disabled={disabled}
                            />
                            <DragDropFile
                                callToAction={'Добавьте изображение'}
                                name='image'
                                state={{ image: image }}
                                setState={(state) => handleChangeImage(state.image)}
                                accept="image/*"
                                disabled={disabled}
                            />
                        </div>
                    </div>
                    <div className="question-content-block">
                        <p className="question-block-title">Введите варианты ответа, правильные ответы отметьте галочкой слева</p>
                        <div className="question-content-controls">
                            <div className="question-content-switch">
                                <Switch
                                    checkedChildren={<CheckOutlined />}
                                    unCheckedChildren={<CloseOutlined />}
                                    onChange={(e) => handleChangeSwitch(e)}
                                    checked={isMultiple}
                                    className='testsConstructor-switch'
                                    name='switch'
                                    disabled={disabled}
                                />
                                <label htmlFor='switch' className='testsConstructor-contetnt-label'>Вопрос с множественным выбором</label>
                            </div>
                            <div className="testsConstructor-buttons">
                                <Button
                                    type="primary"
                                    onClick={() => addOption()}
                                    className="testsConstructor-btn testsConstructor-btn-small"
                                    disabled={disabled}
                                >
                                    + Вариант ответа
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="question-content-block">
                        <Checkbox.Group
                            onChange={(options) => handleCheckboxGroupChange(options)}
                            value={selectedOptions}
                        >
                            {options.map((option, index) => (
                                <div className="question testsConstructor-content-question" key={index}>
                                    <div className="checkbox-one question-content-block ">
                                        <Checkbox
                                            value={index}
                                            className="checkbox-pink"
                                            name="isValid"
                                            onChange={(e) => handleCheckboxChange(e, index)}
                                            disabled={disabled}
                                        >
                                            <div className="question-content-item">
                                                <input
                                                    type="text"
                                                    placeholder="Вариант ответа"
                                                    className="testsConstructor-input question-input"
                                                    value={option.title}
                                                    onChange={(e) => handleChangeOption(e, index)}
                                                    name="title"
                                                    disabled={disabled}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => deleteOption(index)}
                                                    disabled={disabled}
                                                >
                                                    <img
                                                        className="testsConstructor-icon"
                                                        src={iconDelete}
                                                        alt="delete"
                                                    />
                                                </button>
                                            </div>
                                        </Checkbox>
                                    </div>
                                </div>
                            )
                            )}
                        </Checkbox.Group>
                        <div className="question-content-block center">
                            <div className="tests-block-buttons testsConstructor-buttons">
                                {!disabled && <Button
                                    type="primary"
                                    onClick={handleSaveQuestion}
                                    className="greenBtn constructor-button"
                                >
                                    Сохранить вопрос
                                </Button>}
                                {!disabled && isEdit &&
                                    <Button
                                        type="primary"
                                        onClick={handleCancelEdit}
                                        className="testsConstructor-btn testsConstructor-btn-small"
                                    >
                                        Отменить редактирование
                                    </Button>
                                }
                                {disabled &&
                                    <Button
                                        type="primary"
                                        onClick={handleEditQuestion}
                                        className="testsConstructor-btn testsConstructor-btn-small"
                                    >
                                        Редактировать вопрос
                                    </Button>
                                }
                                <Button
                                    type="primary"
                                    onClick={() => setDeleteModal(true)}
                                    className="redBtn constructor-button"
                                >
                                    Удалить вопрос
                                </Button>
                            </div>``
                        </div>
                    </div>
                </div>
            }
            <Modal
                className="groupModal  group-removeModal"
                title={`Удалить вопрос?`}
                open={deleteModal}
                onOk={() => deleteQuestion(index)}
                onCancel={() => setDeleteModal(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => deleteQuestion(index)}
                        className="redBtn"
                    >
                        Удалить
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={() => setDeleteModal(false)}
                        className="greenBtn"
                    >
                        Отменить
                    </Button>
                ]}
            >
                <p>Вы уверены, что хотите удалить вопрос?</p>
            </Modal>
            <Modal
                className="groupModal  group-removeModal"
                title={'Упс! Что-то упустили!'}
                open={infoModal}
                onOk={() => setInfoModal(false)}
                onCancel={() => setInfoModal(false)}
                footer={null}
            >
                <div className="modal-content">
                    {questionTitleError && <p>{questionTitleError}</p>}
                    {optionsError && <p>{optionsError}</p>}
                    {selectedOptionsError && <p>{selectedOptionsError}</p>}
                    {optionTitleError && <p>{optionTitleError}</p>}
                </div>
            </Modal>
            <Modal
                className="groupModal  group-removeModal"
                title={'Поздравляем!'}
                open={saveModal}
                onOk={() => setSaveModal(false)}
                onCancel={() => setSaveModal(false)}
                footer={null}
            >
                <div className="modal-content">
                    <p>Вопрос успешно сохранен!</p>
                </div>
            </Modal>
        </div >
    )
}

export default inject(({ }) => {
    return {}
})(observer(Question));