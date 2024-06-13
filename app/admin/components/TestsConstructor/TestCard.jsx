import React, { useState } from "react";
import { Button, Card, Modal } from "antd";
import Question from "./Question";
import { v4 as uuidv4 } from 'uuid';

const TestCard = ({ questions, setQuestions, lesson, isEdit, saveModal, setSaveModal, defaultQuestions }) => {
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {}
        ])
    }

    const deleteQuestion = (index) => {
        const data = [...questions];
        data.splice(index, 1);
        setQuestions(data);
    }

    const saveQuestion = (index, question) => {
        const data = [...questions];
        data[index] = { ...question };
        setSaveModal(true);
        setQuestions(data);
    }

    return (
        <Card className="testsConstructor-card">
            <div className="testsConstructor-testInfo">
                <h2 className="block-title">Тест к уроку: {lesson ? lesson : ''}</h2>
                <p className="testInfo-text">Состоит из {questions.length} вопросов</p>
            </div>

            {questions && questions.map((item, index) => (
                <div className="testsConstructor-questionsBlock" key={uuidv4()}>
                    <Question
                        index={index}
                        currentQuestion={item}
                        saveQuestion={saveQuestion}
                        deleteQuestion={deleteQuestion}
                        isEdit={isEdit || false}
                        defaultQuestion={defaultQuestions ? defaultQuestions[index] : item}
                    />
                </div>
            ))}

            <div className="constructor-moduleBtns">
                <Button
                    type="primary"
                    onClick={() => addQuestion()}
                    className="testsConstructor-btn testsConstructor-btn-small"
                >
                    <span className="btn-plus">+</span>
                    Вопрос
                </Button>
            </div>

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
        </Card>
    );
};

export default TestCard;
