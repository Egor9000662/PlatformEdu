import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import Input from '../../../common/components/Input/Input';


const AddModuleForm = ({ addModule, cancelAddModule, isModalModuleVisible }) => {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [lessonsNumber, setLessonsNumber] = useState('');
    const [error, setError] = useState(false);

    const clearStates = () => {
        setName('');
        setDuration('');
        setLessonsNumber('');
    }

    const handleCreateModule = () => {
        if (!name || !duration || !lessonsNumber) {
            setError(true);
            return
        }
        setError(false);
        addModule({
            name: name.trim(),
            duration,
            lessons: [...Array(+lessonsNumber)].map((index) => ({})),
        });
        clearStates();
    }

    const handleCancelCraeteModule = () => {
        cancelAddModule();
        clearStates();
    }

    return (
        <Modal
            className="groupModal  group-removeModal"
            title={`Добавить модуль`}
            open={isModalModuleVisible}
            onOk={handleCreateModule}
            onCancel={() => handleCancelCraeteModule()}
            footer={[
                <Button
                    key="cancel"
                    onClick={() => handleCancelCraeteModule()}
                    className="redBtn"
                >
                    Отменить
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    onClick={handleCreateModule}
                    className="greenBtn"
                >
                    Сохранить
                </Button>
            ]}
        >
            <form className="form-addModule">
                <div>
                    <h2 className="addModule-title">Название Модуля *</h2>
                    <Input
                        className="addModule__input"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        name="title"
                        type="text"
                        placeholder="Название модуля *"
                        minLength="2"
                        maxLength="100"
                        required
                    />
                </div>
                <div>
                    <h2 className="addModule-title">Длительность модуля в неделях *</h2>
                    <Input
                        className="addModule__input"
                        onChange={(e) => setDuration(e.target.value)}
                        value={duration}
                        name="duration"
                        type="number"
                        placeholder="Длительность модуля *"
                        min="1" max="100"
                        required
                    />
                </div>
                <div>
                    <h2 className="addModule-title">Количество уроков</h2>
                    <Input
                        className="addModule__input"
                        onChange={(e) => setLessonsNumber(e.target.value)}
                        value={lessonsNumber}
                        name="duration"
                        type="number"
                        placeholder="Количество уроков"
                        min="1" max="100"
                    />
                </div>
                {error && <div className="error-message">Заполните все необходимые поля</div>}
            </form>
        </Modal>

    )
}

export default AddModuleForm;
