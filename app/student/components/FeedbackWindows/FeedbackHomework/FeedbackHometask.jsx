import React, { useState, useEffect } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import FeedbackForm from './../FeedbackForm/FeedbackForm';
import FeedbackComment from '../FeedbackComment/FeedbackComment';

export default function FeedbackHometask({
	themeHomework,
	hometaskId,
	showEstimationModalForm,
	setFeedbackSentFlag,
}) {
	const feedbackType = 'hometask';
	const [quality, setQuality] = useState(0);
	const [remarkNeeded, setRemarkNeeded] = useState(false);

	const handleRemarkNeeded = (val) => {
		setRemarkNeeded(val);
	};
	const handleChangeQuality = (quality) => {
		setQuality(quality);
	};
	return (
		<div>
			{!remarkNeeded ? (
				<FeedbackForm
					id={hometaskId}
					title={themeHomework}
					feedbackType={feedbackType}
					onChangeRemarkNeeded={handleRemarkNeeded}
					showEstimationModalForm={showEstimationModalForm}
					onChangeQuality={handleChangeQuality}
					setFeedbackSentFlag={setFeedbackSentFlag}
				/>
			) : (
				<FeedbackComment
					id={hometaskId}
					title={themeHomework}
					feedbackType={feedbackType}
					feedbackQuality={quality}
					showEstimationModalForm={showEstimationModalForm}
					setFeedbackSentFlag={setFeedbackSentFlag}
				/>
			)}
		</div>
	);
}
