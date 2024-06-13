import React, { useEffect, useState } from 'react';
import { Button, Modal, Radio, Space, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import addButton from '../../../common/assets/controls/chat/add-button.svg';
import DragDropFile from '../DragDropFile/DragDropFile';
import { v4 as uuidv4 } from 'uuid';

const Accordion = ({ currentLesson, index, deleteLesson, saveLesson }) => {
    const [isActive, setIsActive] = useState(false);
    const [isHometaskBlockVisible, setHometaskBlockVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalDeleteLessonVisible, setModalDeleteLessonVisible] = useState(false);

    const [error, setError] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [contentError, setContentError] = useState(false);
    const [videoURLError, setVideoURLError] = useState(false);
    const [accessIntervalError, setAccessIntervalError] = useState(false);

    const [videoLinks, setVideoLinks] = useState(['']);
    const [lesson, setLesson] = useState({});

    useEffect(() => {
        setVideoLinksHandler(currentLesson.video || []);
        setLesson({
            ...currentLesson,
            saved: false,
            accessType: 'interval' || currentLesson.accessType,
            accessInterval: 7 || currentLesson.accessInterval,
            title: currentLesson.title || '',
            description: currentLesson.description || '',
            content: currentLesson.content || '',
        });
    }, []);

    const setVideoLinksHandler = (links) => {
        if (links[links.length - 1] !== '') {
            links.push('');
        } else if (links.length > 1 && links[links.length - 2] === '') {
            links = links.slice(0, -1);
        }
        setVideoLinks(links);
    }

    const blurHandler = (e) => {
        if (e.target.value === '') {
            setTitleError(true);
        } else {
            setTitleError(false);
        }
    }

    const videoLinkHandler = (value, index) => {
        const links = [...videoLinks];
        links[index] = value;
        setVideoLinksHandler(links);
    }

    const accessIntervalHandler = (e) => {
        setLesson({ ...lesson, accessInterval: e.target.value });
        setAccessIntervalError(false);
    }

    const accessTypeHandler = (e) => {
        if (e.target.value !== 'interval') {
            setLesson({ ...lesson, accessType: e.target.value, accessInterval: 0 });
        } else {
            setLesson({ ...lesson, accessType: e.target.value });
        }
    }

    const switchOnChange = (e) => {
        setLesson({ ...lesson, hasHometask: e });
        setHometaskBlockVisible(!isHometaskBlockVisible);
    }

    const saveLessonHandler = () => {
        let hasError = false;
        const RegExp =
            /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)/;

        if (!lesson.title) {
            setTitleError(true);
            hasError = true;
        }
        if (!lesson.content) {
            setContentError(true);
            hasError = true;
        }
        if (videoLinks) {
            let invalid = videoLinks.some((link, index) => {
                if (index === videoLinks.length - 1 && link === '') {
                    return false;
                }
                return !RegExp.test(link);
            });
            setVideoURLError(invalid);
            if (invalid) {
                hasError = true;
            }

        }
        if (lesson.accessType === 'interval' && lesson.accessInterval === 0) {
            setAccessIntervalError(true);
            hasError = true;
        }
        if (!hasError) {
            let video = [...videoLinks];
            video.pop()
            saveLesson(index, { ...lesson, saved: true, video: video });
            setIsActive(false);
            setAccessIntervalError(false);
        }
        setError(hasError);
        setModalVisible(true);
    }

    return (
        <div className="accordion-item">
            <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
                <div>{`Урок ${index + 1}`}</div>
                <img
                    className={isActive ? "accordion-title-button rotated" : "accordion-title-button"}
                    src={addButton}
                    alt="button"
                />
            </div>
            {isActive &&
                <div className="accordion-content">
                    <div className="accordion-content-item">
                        <div>
                            <p className='accordion-message'>Названия загружаемых файлов должны быть написаны латинскими буквами,
                                не должны содержать знаков препинания и небуквенных орфографических знаков</p>
                            <DragDropFile
                                callToAction={'Перетащите файл с содержанием урока'}
                                name='content'
                                state={lesson}
                                setState={setLesson}
                                accept=".html"
                            />
                            {contentError && <span className='error-message'>Необходимо добавить содержание урока</span>}
                        </div>
                        <div className='accordion-contetnt-form'>
                            <label htmlFor='title' className='accordion-contetnt-label'>Добавьте тему урока:</label>
                            {titleError && <div className='error-message'>Поле не может быть пустым</div>}
                            <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                                onBlur={blurHandler}
                                name="title"
                                placeholder="Тема урока"
                                className='accordion-input'
                                required
                            />

                            <label htmlFor='description' className='accordion-contetnt-label'>Добавьте описание урока:</label>
                            <textarea
                                type="text"
                                value={lesson.description}
                                onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
                                name="description"
                                placeholder="Описание урока"
                                className='accordion-input'
                            />
                            <label htmlFor='video' className='accordion-contetnt-label'>Добавьте ссылку на видео:</label>
                            {videoURLError && <div className='error-message'>Введите корректный URL</div>}
                            {videoLinks.map((item, i) => {
                                return (
                                    <input
                                        key={`ren${i + 1}`}
                                        type="text"
                                        value={item}
                                        onChange={(e) => videoLinkHandler(e.target.value, i)}
                                        name="video"
                                        placeholder="Ссылка на видео"
                                        className='accordion-input'
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div className="accordion-content-item accordion-content-item-leftColumn">
                        <label htmlFor='radio' className='accordion-contetnt-label'>Открытие доступа к уроку:</label>
                        {accessIntervalError && <div className='error-message'>Укажите интервал</div>}
                        <Radio.Group
                            onChange={(e) => accessTypeHandler(e)}
                            value={lesson.accessType}
                            name='accessType'
                        >
                            <Space direction="vertical" className='accordion-contetnt-group'>
                                <Radio className='radio-text' value='onValidation'> Сразу после получения учеником зачета по прошлому уроку</Radio>
                                <Radio className='radio-text' value='interval'>Через
                                    <input
                                        type='number'
                                        value={lesson.accessInterval}
                                        onChange={accessIntervalHandler}
                                        min={1} max={14}
                                        className='accordion-input-number'
                                    />
                                    дней после предыдущего</Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                    <div className='accordion-content-item accordion-content-item-left'>
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            onChange={(e) => switchOnChange(e)}
                            className='accordion-switch'
                            name='switch'
                        />
                        <label htmlFor='switch' className='accordion-contetnt-label'>Добавить домашнее задание к уроку?</label>
                    </div>
                    {isHometaskBlockVisible && <div className='accordion-content-item'>
                        <DragDropFile
                            callToAction={'Перетащите файл с заданием по теории'}
                            name='theme'
                            state={lesson}
                            setState={setLesson}
                            accept=".html"
                        />
                        <DragDropFile
                            callToAction={'Перетащите файл с практическим заданием'}
                            name='practice'
                            state={lesson}
                            setState={setLesson}
                            accept=".html"
                        />
                        <DragDropFile
                            callToAction={'Перетащите файл с заданием на развитие мягких навыков'}
                            name='soft-skills'
                            state={lesson}
                            setState={setLesson}
                            accept=".html"
                        />
                        <DragDropFile
                            callToAction={'Перетащите файл с дополнительными материалами'}
                            name='links'
                            state={lesson}
                            setState={setLesson}
                            accept=".html"
                        />
                    </div>}

                    <div className="accordion-content-controls">
                        <Button
                            type="primary"
                            onClick={saveLessonHandler}
                            className="greenBtn constructor-button"
                        >
                            Сохранить урок
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => setModalDeleteLessonVisible(true)}
                            className="redBtn constructor-button"
                        >
                            Удалить урок
                        </Button>
                    </div>

                </div>}
            <Modal
                className="groupModal  group-removeModal"
                title={error ? 'Урок заполнен не полностью!' : 'Поздравляем!'}
                open={isModalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <div>
                    {error ? 'Урок должен иметь содержание и заголовок' : 'Урок успешно сохранен!'}
                </div>
            </Modal>

            <Modal
                className="groupModal  group-removeModal"
                title={`Удалить урок`}
                open={isModalDeleteLessonVisible}
                onCancel={() => setModalDeleteLessonVisible(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            deleteLesson(index);
                            setModalDeleteLessonVisible(false);
                            setIsActive(false);
                        }}
                        className="redBtn"
                    >
                        Удалить
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={() => setModalDeleteLessonVisible(false)}
                        className="greenBtn"
                    >
                        Отменить
                    </Button>
                ]}
            >
                <p>Вы уверены, что хотите удалить урок?</p>
            </Modal>
        </div>
    );
};

export default Accordion;