import React, { useState } from 'react';
import FeedbackForm from '../FeedbackForm/FeedbackForm';
import FeedbackComment from '../FeedbackComment/FeedbackComment';

export default function FeedbackSchool({
    showEstimationModalForm,
    setFeedbackSentFlag,
}) {
    const feedbackType = 'school';
    const [quality, setQuality] = useState(0);
    const [recommended, setRecommended] = useState(false);
    const [remarkNeeded, setRemarkNeeded] = useState(false);

    const handleRemarkNeeded = (val) => {
        setRemarkNeeded(val);
    };
    const handleRecommended = (val) => {
        setRecommended(val);
    };
    const handleChangeQuality = (quality) => {
        setQuality(quality);
    };
    let date = new Date().getTime();
    return (
        <div>
            {!remarkNeeded ? (
                <FeedbackForm
                    id={date}
                    feedbackType={feedbackType}
                    onChangeRemarkNeeded={handleRemarkNeeded}
                    onChangeRecommended={handleRecommended}
                    showEstimationModalForm={showEstimationModalForm}
                    onChangeQuality={handleChangeQuality}
                    setFeedbackSentFlag={setFeedbackSentFlag}
                />
            ) : (
                <FeedbackComment
                    id={date}
                    feedbackType={feedbackType}
                    feedbackQuality={quality}
                    recommended={recommended}
                    showEstimationModalForm={showEstimationModalForm}
                    setFeedbackSentFlag={setFeedbackSentFlag}
                />
            )}
        </div>
    );
}
