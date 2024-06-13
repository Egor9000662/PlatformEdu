import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Button, Modal } from 'antd';
import iconDelete from '../../assets/controls/icon-delete.svg';
import iconCalendar from '../../assets/controls/calendar.svg';
import iconSmile from '../../assets/controls/smile.svg';
import MeetingVideo from '../../components/MeetingVideo/MeetingVideo';
import AddMaterialsForm from '../../components/MeetingForms/AddMaterialsForm';
import { v4 } from 'uuid';

export default function DayContent({ value, meetingDays, adminOrTeacher, groupMeetingModel }) {

    const [hasMeeting, setHasMeeting] = useState(false);
    const [currentGroup, setCurrentGroup] = useState('');
    const [currentVideos, setCurrentVideos] = useState([]);
    const [isModalMoveVisible, setIsModalMoveVisible] = useState(false);
    const [isModalDeleteMeetingsVisible, setIsModalDeleteMeetingsVisible] = useState(false);
    const date = value?.format('DD-MM-YYYY');

    useEffect(() => {
        const hasMeeting = meetingDays.includes(date);
        setHasMeeting(hasMeeting);
        setCurrentVideos(groupMeetingModel.getCurrentVideos(value));
    }, [meetingDays, value]);

    const handleDeleteMeeting = () => {
        groupMeetingModel.deleteMeeting(currentGroup, date);
        setIsModalDeleteMeetingsVisible(false);
    }

    return (
        <>
            {
                !hasMeeting && (<div className="meeting-empty_video">
                    <h1 className="meeting-empty_text">
                        В этот день не было созвонов
                    </h1>
                </div>)
            }
            {currentVideos.length > 0 && currentVideos.map((video) => (
                < MeetingVideo
                    key={video.videoId}
                    video={video}
                    adminOrTeacher={adminOrTeacher}
                    removeVideo={() => groupMeetingModel.deleteMeeting(video.groupId, date)}
                />
            ))
            }
            {hasMeeting && groupMeetingModel.getMeetingDataByDate(date)
                .map((meeting) => (
                    <div className="meeting-container" key={v4()}>
                        <div className="meeting-videoHeader">
                            {adminOrTeacher ? (
                                <button
                                    className="meeting-videoDeleteBtn"
                                    onClick={() => {
                                        setCurrentGroup(meeting.group);
                                        setIsModalDeleteMeetingsVisible(true)
                                    }}
                                >
                                    <img className="iconDelete" src={iconDelete} alt="delete" />
                                </button>
                            ) : (null)
                            }
                            <h5 className="meeting-title "> Встреча с группой {meeting.group} </h5>
                        </div>
                        <div className="meeting-description">
                            <div>
                                <img alt='calendar' src={iconCalendar} className="meetingIcon" />
                                <Moment className="videoDate" locale="ru" format="DD MMMM, YYYY">
                                    {value}
                                </Moment>
                                <span className="videoDate"> в {meeting.time} (МСК) </span>
                            </div>
                            <div>
                                <img alt='smile' src={iconSmile} className="meetingIcon" />
                                <span className="videoSpeaker"> {meeting.mentor} </span>
                            </div>
                        </div>
                        {
                            adminOrTeacher && (
                                <Button
                                    className="addMaterials-button"
                                    onClick={() => {
                                        setCurrentGroup(meeting.group);
                                        setIsModalMoveVisible(true)
                                    }}
                                    style={{ boxShadow: 'none' }}
                                >
                                    Добавить материалы
                                </Button>
                            )
                        }
                    </div>
                ))}
            <AddMaterialsForm
                isModalMoveVisible={isModalMoveVisible}
                setIsModalMoveVisible={setIsModalMoveVisible}
                groupMeetingModel={groupMeetingModel}
                currentGroup={currentGroup}
                meetingId={date}
            />
            <Modal
                className="stdModal std-moveModal"
                title="Удалить встречу"
                open={isModalDeleteMeetingsVisible}
                onOk={() => setIsModalDeleteMeetingsVisible(false)}
                onCancel={() => setIsModalDeleteMeetingsVisible(false)}
                footer={[
                    <Button
                        key="back"
                        onClick={() => setIsModalDeleteMeetingsVisible(false)}
                        className="redBtn"
                    >
                        Отмена
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleDeleteMeeting}
                        className="greenBtn"
                    >
                        Ок
                    </Button>,
                ]}
            >
                <p>Вы действительно хотите удалить встречу?</p>
            </Modal>
        </>
    )


};
