import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import '../../pages/GroupMeeting/GroupMeeting.scss';
import '../../../admin/components/StudentsList/StudentsList.scss';
import '../../../admin/components/Student/Student.scss';
import selectCheckmark from '../../assets/controls/select_checkmark.svg';

export default function AddMaterialsForm({
    isModalAddMeetingsVisible,
    setIsModalAddMeetingsVisible,
    groupMeetingModel,
}) {

    const [group, setGroup] = useState('');
    const [weekday, setWeekday] = useState([]);
    const [time, setTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

    const handleAddMeetings = async () => {
        const errorMessage = groupMeetingModel.validateMeetingsData(group, weekday, time);
        if (!errorMessage) {
            await groupMeetingModel.addMeetingsSchedule(group, weekday, time);
            setIsModalAddMeetingsVisible(false);
            setGroup('');
            setWeekday([]);
            setTime('');
            setErrorMessage('');
        } else {
            setErrorMessage(errorMessage);
        }
    };

    return (
        <Modal
            className="stdModal std-moveModal"
            title="Запланируем регулярные встречи?"
            open={isModalAddMeetingsVisible}
            onOk={() => setIsModalAddMeetingsVisible(false)}
            onCancel={() => setIsModalAddMeetingsVisible(false)}
            footer={[
                <Button
                    key="back"
                    onClick={() => setIsModalAddMeetingsVisible(false)}
                    className="redBtn"
                >
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleAddMeetings}
                    className="greenBtn"
                >
                    Ок
                </Button>,
            ]}
        >

            <div className="stdMove-selectContainer">
                <select
                    name="group"
                    id="groupSelect"
                    onChange={(e) => setGroup(e.target.value)}
                    className="stdMove-select"
                    value={group}
                >
                    <option value="" defaultValue>
                        Выберите группу *
                    </option>
                    {groupMeetingModel.groups?.map((groupInfo) => {
                        return (
                            <option key={groupInfo.id} value={groupInfo.id}>
                                {groupInfo.id}
                            </option>
                        );
                    })}
                </select>
                <img src={selectCheckmark} className="stdMove-checkMark" />
            </div>

            <div className="addMentor-selectContainer">
                <Select
                    mode="multiple"
                    id="course"
                    onChange={(e) => setWeekday(e)}
                    placeholder="День недели *"
                    value={weekday}
                >
                    {days.map((day) => (
                        <Select.Option key={day} value={day}>
                            {day}
                        </Select.Option>
                    ))}
                </Select>
                <img src={selectCheckmark} className="addMentor-checkMark" />
            </div>

            <input
                type="time"
                onChange={(e) => setTime(e.target.value)}
                value={time}
                className="input-video"
            />

            {errorMessage && (
                <span className="video-err-message">
                    {errorMessage}
                </span>
            )}
        </Modal>
    );
}
