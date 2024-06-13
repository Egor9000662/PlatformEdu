import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { inject, observer } from "mobx-react";
import { Divider, Button, Modal } from "antd";
import { v4 as uuidv4 } from 'uuid';
import AddModuleForm from '../../components//AddModuleForm/AddModuleForm';
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import { createCourse } from './AddCourseMethods.js'
import "./AddCoursePage.scss";

const AddCoursePage = ({ oneCourseStore, coursesStore }) => {
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [courseSaveError, setCourseSaveError] = useState(false);
    const [emptyLessonError, setEmptyLessonError] = useState(false);
    const [modules, setModules] = useState([]);

    const [isModalModuleVisible, setModalModuleVisible] =
        useState(false);
    const [isModalSaveCourseVisible, setModalSaveCourseVisible] = useState(false);

    const addModule = (module) => {
        setModules([...modules, module])
        setModalModuleVisible(false);
    }

    const cancelAddModule = () => {
        setModalModuleVisible(false);
    }

    const deleteModule = (module) => {
        let filteredArray = modules.filter(item => item !== module)
        setModules(filteredArray);
    }

    const saveCourse = () => {
        const course = createCourse(modules, courseDescription);
        oneCourseStore.addCourse(courseTitle, course);
    }

    const handleSaveCourse = () => {
        let hasError = false;
        let emptyLesson = modules.some(item => item.lessons.some(lesson => !lesson || !lesson.saved));
        if (emptyLesson) {
            setEmptyLessonError(true);
            hasError = true;
        }
        if (!courseTitle || !courseDescription || modules.length === 0) {
            setCourseSaveError(true);
            hasError = true;
        }
        if (!hasError) {
            saveCourse();
            setCourseSaveError(false);
            setEmptyLessonError(false);
            setCourseTitle('');
            setCourseDescription('');
            setModules([]);
        }
        setModalSaveCourseVisible(true);
		coursesStore.setLoadedCourse(false);
    }

    return (
        <div className="courseListWrapper">
            <div className="constructor-header">
                <BackArrow pathName={'/groups'} />
            </div>
            <Divider orientation="center" id='divider'>
                <span id='divider-text'>
                    Добавить новый курс
                </span>
            </Divider>

            <div className="constructor-container">
                <form action="" className="constrictor-form">
                    <div className="constructor-block">
                        <h1 className="block-title">Введите название курса</h1>
                        <input
                            type="text"
                            placeholder="Название курса"
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            className="constructor-input"
                        />
                    </div>
                    <div className="constructor-block">
                        <h1 className="block-title">Добавьте описание курса</h1>
                        <textarea
                            type="text"
                            placeholder="Описание курса"
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            className="constructor-input constructor-textarea"
                        />
                    </div>
                    <div className="constructor-block">
                        <h1 className="block-title">Добавить модуль</h1>
                        {modules.length > 0 &&
                            modules.map((item) =>
                                <ModuleCard
                                    key={uuidv4()}
                                    module={item}
                                    deleteModule={deleteModule}
                                />
                            )
                        }
                        <Button
                            type="primary"
                            onClick={() => setModalModuleVisible(true)}
                            className={modules.length > 0 ? "greenBtn constructor-button" : "greenBtn constructor-button-big"}
                        >
                            <span className="btn-plus">+</span>
                            Модуль
                        </Button>
                    </div>

                    {modules.length > 0 && <div className="center">
                        <Button
                            type="primary"
                            onClick={handleSaveCourse}
                            className="greenBtn constructor-button"
                        >
                            Сохранить курс
                        </Button>
                    </div>}
                </form>
            </div >

            <AddModuleForm
                addModule={addModule}
                cancelAddModule={cancelAddModule}
                isModalModuleVisible={isModalModuleVisible}
            />

            <Modal
                className="groupModal  group-removeModal"
                title={courseSaveError || emptyLessonError ? 'Внесите полную информацию о курсе' : 'Курс успешно сохранен!'}
                open={isModalSaveCourseVisible}
                onOk={() => setModalSaveCourseVisible(false)}
                onCancel={() => setModalSaveCourseVisible(false)}
                footer={null}
            >
                <div className="modal-content">
                    {courseSaveError && <p>
                        Информация о курсе должна содержать название курса, описание и хотя бы один модуль с уроками
                    </p>}
                    {emptyLessonError && <p>Все уроки должны быть сохранены</p>}
                    {!courseSaveError && !emptyLessonError &&
                        <div className="modal-content">
                            <p>Поздравляем! Вы создали курс!</p>
                            <Link to="/constructor/test-form"
                                type="primary"
                                className="greenBtn constructor-button"
                            >
                                Перейти к добавлению теста
                            </Link>
                        </div>

                    }
                </div>
            </Modal>
        </div >
    );
}

export default inject(({ oneCourseStore, coursesStore }) => {
    return { oneCourseStore, coursesStore }
})(observer(AddCoursePage));
