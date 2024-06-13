import React, { useState } from 'react';
import './FeedbackMeetingForm.scss';
import StarRating from '../../../../common/components/StarsRating/StarRating';
import { inject, observer } from 'mobx-react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

function FeedbackMeetingForm({
	uid,
	id,
	videoId,
	sendFeedback,
	showEstimationModalForm,
	onChangeQuality,
	title,
	mentorUid,
	feedbackType,
	setFeedbackSentFlag,
}) {
	const [feedbackQuality, setFeedbackQuality] = useState(0);

	const handleChangeQuality = (quality) => {
		if (quality === 0) {
			return;
		}
		setFeedbackQuality(quality);
		if (quality < 5) {
			onChangeQuality(quality);
			showEstimationModalForm(true);
		}
		if (quality === 5) {
			handleSendFeedback(quality);
			showEstimationModalForm(false);
		}
	};

	const handleSendFeedback = (feedbackQuality) => {
		const feedbackRemarkValue = '';
		const feedbackDifficulty = null;
		sendFeedback(
			uid,
			id,
			feedbackType,
			feedbackRemarkValue,
			feedbackQuality,
			feedbackDifficulty,
			title,
			mentorUid,
			videoId
		);
		setFeedbackSentFlag(true);
	};
	return (
		<div className="feedback-meeting-container">
			<StarRating
				numTotalStars="5"
				initialRating={feedbackQuality}
				starsFor="quality"
				onChangeQuality={handleChangeQuality}
			/>
		</div>
	);
}

export default inject(({ feedbackStore, auth }) => {
	const { sendFeedback } = feedbackStore;
	const { user } = auth;
	const { uid } = user;

	return {
		uid,
		sendFeedback,
	};
})(observer(FeedbackMeetingForm));
