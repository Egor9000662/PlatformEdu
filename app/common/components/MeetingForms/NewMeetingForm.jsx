import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import '../../pages/GroupMeeting/GroupMeeting.scss';
import '../../../admin/components/StudentsList/StudentsList.scss';
import '../../../admin/components/Student/Student.scss';
import selectCheckmark from '../../assets/controls/select_checkmark.svg';

export default function AddMaterialsForm({
    isModalAddMeetingVisible,
    setIsModalAddMeetingVisible,
    groupMeetingModel,
    meetingId,
}) {

    const [group, setGroup] = useState('');
    const [time, setTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddMeeting = async () => {
        const hasError = groupMeetingModel.validateMeetingsData(group, [meetingId], time)
        if (!hasError) {
            await groupMeetingModel.addNewMeeting(group, meetingId, time);
            setGroup('');
            setTime('');
            setErrorMessage('');
            setIsModalAddMeetingVisible(false);
        } else {
            setErrorMessage(hasError);
        }
    };

    return (
        <Modal
            className="stdModal std-moveModal"
            title={`Добавить встречу ${meetingId}?`}
            open={isModalAddMeetingVisible}
            onOk={() => setIsModalAddMeetingVisible(false)}
            onCancel={() => setIsModalAddMeetingVisible(false)}
            footer={[
                <Button
                    key="back"
                    onClick={() => setIsModalAddMeetingVisible(false)}
                    className="redBtn"
                >
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleAddMeeting}
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
