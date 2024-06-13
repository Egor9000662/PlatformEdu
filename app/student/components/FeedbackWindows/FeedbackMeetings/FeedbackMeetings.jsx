import React, { useState, useEffect } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Modal } from 'antd';
import './FeedbackMeetings.scss';
import FeedbackMeetingForm from './FeedbackMeetingForm';
import FeedbackComment from '../FeedbackComment/FeedbackComment';

function FeedbackMeetings({
	videoId,
	themeMeeting,
	lessonId,
	feedbackData,
	getFeedbackbyType,
	checkSent,
	mentorUid,
	groupId,
	groupsStore
}) {
	const feedbackType = 'meeting';
	const [quality, setQuality] = useState(0);
	const [estMeetingModalVisible, setEstMeetingModalVisible] = useState(false);
	const [feedbackSentFlag, setFeedbackSentFlag] = useState(false);
	let meetingsFeedbackSent = false;

	const handleEstMeetingCancel = () => {
		setEstMeetingModalVisible(false);
	};

	const showEstimationModalForm = (val) => {
		setEstMeetingModalVisible(val);
	};
	const handleChangeQuality = (quality) => {
		setQuality(quality);
	};

	if (feedbackData) {
		const feedbackInfo = JSON.parse(JSON.stringify(feedbackData));
		const feedbackMeeting =
			getFeedbackbyType(feedbackInfo, 'meeting') || [];
		meetingsFeedbackSent =
			checkSent(feedbackMeeting, lessonId, videoId) || false;
	}

	const getGroupMentor = (groupId) => {
		const group = groupsStore.getGroup(groupId);
		group.loadData();
		const mentorData = JSON.parse(JSON.stringify(group.mentor));
		const mentor = Object.values(mentorData)[0];
		return mentor?.uid;
	}

	return (
		<div>
			{feedbackSentFlag || meetingsFeedbackSent ? (
				<h2 className="feedbackMeetingSent-text">Спасибо за отзыв!</h2>
			) : (
				<FeedbackMeetingForm
					id={lessonId}
					videoId={videoId}
					title={themeMeeting}
					mentorUid={getGroupMentor(groupId)}
					feedbackType={feedbackType}
					showEstimationModalForm={showEstimationModalForm}
					onChangeQuality={handleChangeQuality}
					setFeedbackSentFlag={setFeedbackSentFlag}
				/>
			)}
			<Modal
				open={estMeetingModalVisible}
				onCancel={handleEstMeetingCancel}
				footer={null}
				width="350px"
				className="estimation-meetings-modal"
			>
				<FeedbackComment
					id={lessonId}
					videoId={videoId}
					title={themeMeeting}
					mentorUid={getGroupMentor(groupId)}
					feedbackType={feedbackType}
					feedbackQuality={quality}
					showEstimationModalForm={setEstMeetingModalVisible}
					setFeedbackSentFlag={setFeedbackSentFlag}
				/>
			</Modal>
		</div>
	);
}

export default inject(({ auth, feedbackStore, groupsStore }) => {
	const { user, profile } = auth;
	const { uid } = user;
	const { getGroup } = groupsStore;
	const {
		feedback: feedbackData,
		loadData: loadFeedback,
		isLoaded,
		getFeedbackbyType,
		checkSent,
	} = feedbackStore;

	useEffect(async () => {
		await loadFeedback(uid);
	}, [isLoaded]);

	// const group = getGroup(profile?.group);
	// useEffect(() => {
	// 	group.loadData();
	// }, [group]);

	// const mentorData = JSON.parse(JSON.stringify(group.mentor));
	// const mentor = Object.values(mentorData)[0];
	// const mentorUid = mentor?.uid;

	return {
		feedbackData,
		getFeedbackbyType,
		checkSent,
		// mentorUid,
		groupsStore,
	};
})(observer(FeedbackMeetings));
