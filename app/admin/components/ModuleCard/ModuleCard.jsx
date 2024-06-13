import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "antd";
import Accordion from "./Accordion";

const ModuleCard = ({ module, deleteModule }) => {
    const [lessons, setLessons] = useState([]);
    const [isModalModuleVisible, setModalModuleVisible] = useState(false);

    useEffect(() => {
        setLessons(module.lessons)
    }, []);

    useEffect(() => {
        module.lessons = lessons;
    }, [lessons]);

    const deleteLesson = (index) => {
        let arr = [...lessons];
        arr.splice(index, 1);
        setLessons(arr);
    }

    const addLesson = () => {
        setLessons([...lessons, {}])
    }

    const saveLesson = (index, lesson) => {
        let arr = [...lessons];
        arr[index] = lesson;
        setLessons(arr);
    }

    return (
        <Card className="constructor-card">
            <div className="constructor-moduleInfo">
                <h2 className="block-title">Модуль: {module.name}</h2>
                <p className="block-text">Длительность: {module.duration} {module.duration > 4 ? 'недель' : 'недели'}</p>
            </div>
            <div className="constructor-moduleLessons">
                {lessons.map((item, index) =>
                    <Accordion
                        key={index}
                        index={index}
                        currentLesson={item}
                        deleteLesson={deleteLesson}
                        saveLesson={saveLesson}
                    />
                )
                }
            </div>
            <div className="constructor-moduleBtns">
                <Button
                    type="primary"
                    onClick={() => addLesson()}
                    className="greenBtn constructor-button"
                >
                    <span className="btn-plus">+</span>
                    Урок
                </Button>
                <Button
                    type="primary"
                    onClick={() => setModalModuleVisible(true)}
                    className="redBtn constructor-button"
                >
                    Удалить модуль
                </Button>
            </div>

            <Modal
                className="groupModal  group-removeModal"
                title={`Удалить модуль?`}
                open={isModalModuleVisible}
                onOk={() => deleteModule(module)}
                onCancel={() => setModalModuleVisible(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => deleteModule(module)}
                        className="redBtn"
                    >
                        Удалить
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={() => setModalModuleVisible(false)}
                        className="greenBtn"
                    >
                        Отменить
                    </Button>
                ]}
            >
                <p>Вы уверены, что хотите удалить модуль?</p>
            </Modal>
        </Card>
    );
};

export default ModuleCard;