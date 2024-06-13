import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { Link } from 'react-router-dom';
import { Button, Divider, Modal } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import './TestsPage.scss';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import addButton from '../../../common/assets/controls/chat/add-button.svg';
import selectCheckmark from '../../../common/assets/controls/select_checkmark.svg';
import TestCard from "../../components/TestsConstructor/TestCard";
import { validateTest, getTestsStructured, setLessonByTitle, saveTest, getLessonsWithTests } from './TestsController'

const TestsPage = ({ coursesStore }) => {
    const [course, setCourse] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [block, setBlock] = useState('');
    const [lessons, setLessons] = useState([]);
    const [lesson, setLesson] = useState({});
    const [tests, setTests] = useState();
    const [filteredTests, setFilteredTests] = useState();
    const [defaultTests, setDefaultTests] = useState([]);
    const [filteredDefaultTests, setFilteredDefaultTests] = useState([]);
    const [testToDelete, setTestToDelete] = useState();

    const [deleteModal, setDeleteModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    const [courseError, setCourseError] = useState('');
    const [unsavedQuestionsError, setUnsavedQuestionsError] = useState('');

    let currentCourse = {};

    const clearStates = () => {
        setTests([]);
        setDefaultTests([]);
        setFilteredDefaultTests([]);
        setFilteredTests([]);
        setBlocks([]);
        setLessons([]);
    }

    const courseChangeHandler = async () => {
        if (!course) {
            currentCourse = {};
            clearStates();
            return
        }
        currentCourse = await coursesStore.getCourseById(course);

        if (currentCourse) {
            const courseTests = await currentCourse.getTests();
            const testsToSet = getTestsStructured(courseTests);
            let testsToSetCopy = testsToSet.map(test => ({
                ...test,
                questions: test.questions.map(question => ({
                    ...question,
                })),
            }));
            setDefaultTests(testsToSetCopy);
            setFilteredDefaultTests(testsToSetCopy);
            setTests(testsToSet);
            setFilteredTests(testsToSet);

            setBlocks(Object.entries(currentCourse.blocks)
                .map(([key, value]) => ({
                    id: key,
                    ...value,
                })));

            const lessonsWithTests = getLessonsWithTests(currentCourse.lessons);
            setLessons(Object.entries(lessonsWithTests)
                .map(([key, value]) => ({
                    id: key,
                    ...value,
                })));
        }
    }

    useEffect(() => {
        courseChangeHandler();
    }, [course]);

    const filterTests = (test) => {
        switch (true) {
            case block === '' && !lesson.title:
                return true;
            case block === '' && test.lesson === lesson.title:
                return true;
            case block === test.block && !lesson.title:
                return true;
            case block === test.block && test.lesson === lesson.title:
                return true;
            default:
                return false;
        }
    }

    useEffect(() => {
        setFilteredDefaultTests(defaultTests?.filter(
            filterTests
        ));
        setFilteredTests(tests?.filter(
            filterTests
        ));
    }, [block, lesson]);

    const blockChangeHandler = async () => {
        currentCourse = await coursesStore.getCourseById(course);
        if (currentCourse) {
            const lessonsWithTests = getLessonsWithTests(currentCourse.lessons);
            if (block) {
                setLessons(Object.entries(lessonsWithTests)
                    .filter(([key, value]) => value.block.toLowerCase() === block.toLowerCase())
                    .map(([key, value]) => ({
                        id: key,
                        ...value,
                    })));
            } else {
                setLessons(Object.entries(lessonsWithTests)
                    .map(([key, value]) => ({
                        id: key,
                        ...value,
                    })));
            }
        }
    }

    useEffect(() => {
        blockChangeHandler();
    }, [block]);

    const onBlockChange = (value) => {
        if (value === block) {
            return;
        }
        setBlock(value);
        setLesson({});
    }

    const onCourseChange = (e) => {
        clearStates();
        setCourse(e.target.value);
    }

    const setQuestions = (questions, index) => {
        const newTests = [...tests];
        newTests[index].questions = questions;
        setTests(newTests);
    }

    const handleSaveTest = (index) => {
        const test = tests[index];
        let hasError = validateTest(test.questions, course, setCourseError, setUnsavedQuestionsError);
        if (!hasError) {
            const currentCourse = coursesStore.getCourseById(course);
            const lesson = setLessonByTitle(test.lesson, lessons, setLesson);
            saveTest(test.questions, (questions) => setQuestions(questions, index),
                currentCourse.addTest, test.id, lesson);
        }
        setInfoModal(true);
    }

    const handleDeleteTest = (index) => {
        const test = tests[index];
        const currentCourse = coursesStore.getCourseById(course);
        const lesson = lessons.find((lesson) => lesson.title === test.lesson);
        currentCourse.deleteTest(test.id, lesson);
        const newTests = [...tests];
        newTests.splice(index, 1);
        setTests(newTests);
        setDeleteModal(false);
    }

    return (
        <div className="tests-container">
            <div className="tests-header">
                <BackArrow pathName={'/groups'} />
                <Link to="/constructor/test-form">
                    <img
                        className="tests-header-icon"
                        src={addButton}
                        alt="add tests"
                        title="Add Test"
                    />
                </Link>
            </div>
            <Divider orientation="center" id='divider'>
                <span id='divider-text'>
                    Тесты
                </span>
            </Divider>

            <div className="tests-content-container">
                <div className="tests-block testsConstructor-selectContainer">
                    <select
                        name="course"
                        className="testsConstructor-input testsConstructor-select"
                        value={course}
                        onChange={onCourseChange}
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
                <div className="tests-block testsConstructor-selectContainer">
                    <select
                        name="block"
                        className="testsConstructor-input testsConstructor-select"
                        value={block.id}
                        onChange={(e) => onBlockChange(e.target.value)}
                    >
                        <option value="" defaultValue>
                            Выбрать блок
                        </option>
                        {blocks.map((block) => (
                            <option key={block.id} value={block.id}>
                                {block.id}
                            </option>
                        ))}
                    </select>
                    <img src={selectCheckmark} className="testsConstructor-checkMark" />
                </div>
                <div className="tests-block testsConstructor-selectContainer">
                    <select
                        name="lesson"
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
                    <img src={selectCheckmark} className="testsConstructor-checkMark" />
                </div>

                {filteredTests && filteredTests
                    .map((test, index) => (
                        <div className="tests-block testsConstructor-selectContainer" key={uuidv4()}>
                            <TestCard
                                key={test.id}
                                questions={test.questions}
                                setQuestions={(questions) => setQuestions(questions, index)}
                                lesson={test.lesson}
                                isEdit={true}
                                saveModal={saveModal}
                                setSaveModal={setSaveModal}
                                defaultQuestions={filteredDefaultTests ? filteredDefaultTests[index]?.questions : []}
                            />
                            <div className="tests-block-buttons">
                                <Button
                                    type="primary"
                                    onClick={() => handleSaveTest(index)}
                                    className="greenBtn constructor-button"
                                >
                                    Сохранить тест
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setDeleteModal(true);
                                        setTestToDelete(index);
                                    }}
                                    className="redBtn constructor-button"
                                >
                                    Удалить тест
                                </Button>
                            </div>
                        </div>
                    ))}
                <Modal
                    className="groupModal  group-removeModal"
                    title={`Удалить тест?`}
                    open={deleteModal}
                    onOk={handleDeleteTest}
                    onCancel={() => setDeleteModal(false)}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={() => handleDeleteTest(testToDelete)}
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
                    title={courseError || unsavedQuestionsError ? 'Упс! Что-то упустили' : 'Поздравляем!'}
                    open={infoModal}
                    onOk={() => setInfoModal(false)}
                    onCancel={() => setInfoModal(false)}
                    footer={null}
                >
                    <div className="modal-content">
                        {courseError && <p>{courseError}</p>}
                        {unsavedQuestionsError && <p>{unsavedQuestionsError}</p>}
                        {!courseError && !unsavedQuestionsError && <p>Тест успешно сохранен!</p>}
                    </div>
                </Modal>
            </div>
        </div >
    );
}

export default inject(({ coursesStore }) => {
    useEffect(() => {
        coursesStore.loadDataCourse();
    }, [coursesStore.isLoaded]);

    return { coursesStore }
})(observer(TestsPage));