import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import './MeetingVideo.scss';
import ReactPlayer from 'react-player/youtube';
import FeedbackMeetings from './../../../student/components/FeedbackWindows/FeedbackMeetings/FeedbackMeetings';
import iconDelete from '../../assets/controls/icon-delete.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import iconCalendar from '../../assets/controls/calendar.svg';
import iconSmile from '../../assets/controls/smile.svg';
import { Modal, Button } from 'antd';
import Moment from 'react-moment';

function MeetingVideo({
	video,
	adminOrTeacher,
	videoId,
	groupId,
	lesson,
	removeVideo,
	setLoaded,
}) {
	const [isModalVideoRemoveVisible, setIsModalVideoRemoveVisible] =
		useState(false);

	const showModalVideoRemove = (event) => {
		event.preventDefault();
		setIsModalVideoRemoveVisible(true);
	};

	const handleCancelVideoRemove = () => {
		setIsModalVideoRemoveVisible(false);
	};

	const deleteVideo = () => {
		removeVideo();
		setLoaded(false);
		setIsModalVideoRemoveVisible(false);
	};

	return (
		<div className="meeting-videoContainer">
			<div className="meeting-videoNavbar">
				<div className="meeting-videoHeader">
					{adminOrTeacher ? (
						<>
							<button
								className="meeting-videoDeleteBtn"
								onClick={showModalVideoRemove}
							>
								<img className="iconDelete" src={iconDelete} alt="delete" />
							</button>
							<h5 className="videoTitle"> {video.groupId}: {video.theme} </h5>
						</>
					) : (
						<h5 className="videoTitle"> {video.groupId}: {video.theme} </h5>
					)}
				</div>
				<div className="meeting-videoDesc">
					<div>
						<img alt='calendar' src={iconCalendar} className="meetingIcon" />
						<Moment className="videoDate" locale="ru" format="DD MMMM, YYYY">
							{new Date(video.date)}
						</Moment>
					</div>
					<div>
						<img alt='smile' src={iconSmile} className="meetingIcon" />
						<span className="videoSpeaker"> {video?.mentor} </span>
					</div>
				</div>
			</div>
			<Modal
				className="groupModal  group-removeModal"
				title={`Удалить видео ${video.theme}`}
				open={isModalVideoRemoveVisible}
				onCancel={handleCancelVideoRemove}
				footer={[
					<Button
						key="back"
						onClick={handleCancelVideoRemove}
						className="redBtn"
					>
						Упс, нет
					</Button>,
					<Button
						key="submit"
						type="primary"
						onClick={deleteVideo}
						className="greenBtn"
					>
						Удаляем
					</Button>,
				]}
			>
				<span>Вы действительно хотите удалить встречу и материалы?</span>
			</Modal>
			<div className="video__block">
				<div className="video__wrapper">
					<ReactPlayer
						className="reactPlayer"
						url={video.link}
						width="100%"
						height="100%"
					/>
				</div>
				{adminOrTeacher ? (
					''
				) : (
					<FeedbackMeetings
						videoId={video.videoId}
						themeMeeting={video.theme}
						weekId={video.week}
						groupId={groupId}
					/>
				)}
			</div>

			<div className="materials">
				{(video.files || video.extraLinks) && <h5 className="materialTitle">Материалы</h5>}
				{video.files && Object.values(video.files).map((file) => {
					return (
						<div className="materialLink" key={file.url}>
							<FontAwesomeIcon className="materialIcon" icon={faPaperclip} />
							<a href={file.url} target="_blank" className="materialText">{file.name}</a>
						</div>
					);
				})}
				{video.extraLinks && Object.values(video.extraLinks).map((link) => {
					return (
						<div className="materialLink" key={link}>
							<FontAwesomeIcon className="materialIcon" icon={faPaperclip} />
							<a href={link} target="_blank" className="materialText">{link}</a>
						</div>
					);
				})}
			</div>

		</div>
	);
}

export default inject(({ groupsStore }) => {
	const { setLoaded } = groupsStore;

	useEffect(() => {
		setLoaded(false);
	}, []);

	return {
		setLoaded,
	};
})(observer(MeetingVideo));
