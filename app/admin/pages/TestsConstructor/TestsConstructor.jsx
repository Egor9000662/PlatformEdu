import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { inject, observer } from "mobx-react";
import { Button, Divider, Input, Modal } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import './TestsConstructor.scss';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import iconTest from '../../assets/controls/icon-test.png';
import selectCheckmark from '../../../common/assets/controls/select_checkmark.svg';
import TestCard from "../../components/TestsConstructor/TestCard";
import { validateTest, setLessonByTitle, saveTest } from '../TestsPage/TestsController';

const TestsConstructor = ({ coursesStore }) => {
    const [course, setCourse] = useState('');
    const [lesson, setLesson] = useState({});
    const [lessons, setLessons] = useState([]);
    const [questionsNumber, setQuestionsNumber] = useState(1);
    const [questions, setQuestions] = useState([]);

    const [deleteModal, setDeleteModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    const [errors, setErrors] = useState(false);
    const [courseError, setCourseError] = useState('');
    const [lessonError, setLessonError] = useState('');
    const [unsavedQuestionsError, setUnsavedQuestionsError] = useState('');

    useEffect(() => {
        if (currentCourse) {
            setLessons(Object.entries(currentCourse.lessons)
                .map(([key, value]) => ({
                    id: key,
                    ...value,
                })));
        }
    }, [course]);

    const currentCourse = coursesStore.getCourseById(course);

    const addTestCard = () => {
        setQuestions(
            [...Array(+questionsNumber)].map((index) => ({}))
        )
    }

    const clearStates = () => {
        setCourse('');
        setLesson({});
        setQuestionsNumber('');
        setQuestions([]);
    }

    const clearErrors = () => {
        setErrors(false);
        setCourseError('');
        setLessonError('');
        setUnsavedQuestionsError('');
    }

    const handleSaveTest = () => {
        clearErrors();
        let hasError = validateTest(questions, course, setCourseError, setUnsavedQuestionsError);;
        if (Object.keys(lesson).length === 0) {
            setLessonError('Выберите урок');
            hasError = true;
        }
        if (!hasError) {
            const testId = uuidv4();
            saveTest(questions, setQuestions, currentCourse.addTest, testId, lesson);
            clearStates();
        }
        setErrors(hasError);
        setInfoModal(true);
    }

    const deleteTest = () => {
        clearStates();
        setDeleteModal(false);
    }

    const hasQuestions = questions.length > 0;

    return (
        <div className="testsConstructor-container">
            <div className="constructor-header">
                <BackArrow pathName={'/groups'} />
                <Link to="/tests">
                    <img
                        className="icon-add-course constructor-header-icon"
                        src={iconTest}
                        alt="all tests"
                        title="All Tests"
                    />
                </Link>
            </div>
            <Divider orientation="center" id='divider'>
                <span id='divider-text'>
                    Добавить тест
                </span>
            </Divider>

            <div className="testsConstructor-content">
                <div className="testsConstructor-block testsConstructor-selectContainer">
                    <select
                        name="course"
                        onChange={(e) => setCourse(e.target.value)}
                        className="testsConstructor-input testsConstructor-select"
                        value={course}
                    >
                        <option value="" defaultValue>
                            Выберите курс
                        </option>

                        {coursesStore.courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.id}
                            </option>
                        ))}
                    </select>
                    <img src={selectCheckmark} className="testsConstructor-checkMark" />
                </div>
                <div className="testsConstructor-block testsConstructor-selectContainer">
                    <select
                        id="user"
                        className="testsConstructor-input testsConstructor-select"
                        onChange={(e) => setLessonByTitle(e.target.value, lessons, setLesson)}
                        value={lesson.title}
                    >
                        <option value="" defaultValue>
                            Выбрать урок
                        </option>
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.title}>
                                {lesson.title}
                            </option>
                        ))}
                    </select>
                    <img src={selectCheckmark}
                        className="testsConstructor-checkMark"
                        alt="checkMark"
                    />
                </div>

                {!hasQuestions && <div>
                    <p className="testsConstructor-block-title">Укажите предварительное количество вопросов</p>
                    <Input
                        className="testsConstructor-input"
                        onChange={(e) => setQuestionsNumber(e.target.value)}
                        value={questionsNumber}
                        name="questionsNumber"
                        type="number"
                        placeholder="Укажите предварительное количество вопросов *"
                        min="1" max="50"
                        required
                    />
                    <div className="testsConstructor-block center">
                        <Button
                            className="testsConstructor-btn"
                            type="submit"
                            onClick={addTestCard}
                        >
                            Продолжить
                        </Button>
                    </div>
                </div>
                }

                {hasQuestions && <div>
                    <div className="testsConstructor-block">
                        <TestCard
                            questions={questions}
                            setQuestions={setQuestions}
                            lesson={lesson.title}
                            saveModal={saveModal}
                            setSaveModal={setSaveModal}
                        />
                    </div>
                    <div className="testsConstructor-block center">
                        <div className="testsConstructor-buttons">
                            <Button
                                type="primary"
                                onClick={handleSaveTest}
                                className="greenBtn constructor-button"
                            >
                                Сохранить тест
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => setDeleteModal(true)}
                                className="redBtn constructor-button"
                            >
                                Удалить тест
                            </Button>
                        </div>
                    </div>
                </div>}
            </div >
            <Modal
                className="groupModal  group-removeModal"
                title={`Удалить тест?`}
                open={deleteModal}
                onOk={() => deleteTest()}
                onCancel={() => setDeleteModal(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => deleteTest()}
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
                <p>Вы уверены, что хотите удалить тест?</p>
            </Modal>
            <Modal
                className="groupModal  group-removeModal"
                title={errors ? 'Упс! Что-то упустили' : 'Поздравляем!'}
                open={infoModal}
                onOk={() => setInfoModal(false)}
                onCancel={() => setInfoModal(false)}
                footer={null}
            >
                <div className="modal-content">
                    {courseError && <p>{courseError}</p>}
                    {lessonError && <p>{lessonError}</p>}
                    {unsavedQuestionsError && <p>{unsavedQuestionsError}</p>}
                    {!errors && <p>Тест успешно сохранен!</p>}
                </div>
            </Modal>
        </div >
    );
}

export default inject(({ coursesStore }) => {
    useEffect(() => {
        coursesStore.loadDataCourse();
    }, [coursesStore.isLoaded]);

    return { coursesStore }
})(observer(TestsConstructor));
