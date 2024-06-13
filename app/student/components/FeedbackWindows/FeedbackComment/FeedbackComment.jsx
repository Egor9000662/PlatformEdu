import React, { useState } from 'react';
import './FeedbackComment.scss';
import { inject, observer } from 'mobx-react';

function FeedbackComment({
	uid,
	id,
	videoId,
	feedbackStore,
	feedbackType,
	feedbackQuality,
	feedbackDifficulty,
	title,
	mentorUid,
	recommended,
	showEstimationModalForm,
	setFeedbackSentFlag,
}) {
	const [feedbackRemarkValue, setFeedbackRemarkValue] = useState('');
	const [showErr, setShowErr] = useState(false);
	const remarkError =
		'Пожалуйста, поделись с нами дополнительной информацией';

	const handleChangeFeedbackRemark = (e) => {
		setFeedbackRemarkValue(e.target.value);
		setShowErr(false);
	};

	const handleCheckRemark = () => {
		if (feedbackRemarkValue !== '') {
			handleSendFeedback();
		}
		if (feedbackRemarkValue === '') setShowErr(true);
	};

	const handleSendFeedback = () => {
		if (feedbackType !== 'meeting') {
			videoId = '';
		}
		feedbackStore.sendFeedback(
			uid,
			id,
			feedbackType,
			feedbackRemarkValue,
			feedbackQuality,
			feedbackDifficulty,
			title,
			mentorUid,
			videoId,
			recommended
		);
		showEstimationModalForm(false);
		setFeedbackSentFlag(true);
	};

	return (
		<div className="feedback-form-container">
			<div className="feedback-comment-border">
				<div className="feedback-comment-card">
					<div className="feedback-comment-card__header-title">
						<p>Тебе что-то не понравилось?</p>
						{feedbackType !== 'hometask' && (
							<p> Что вызвало трудности?</p>
						)}
					</div>
					<div className="feedback-comment-card__description">
						<textarea
							className="feedback-comment-card__description-review"
							placeholder="Твой отзыв"
							value={feedbackRemarkValue}
							onChange={handleChangeFeedbackRemark}
						/>
						{showErr && (
							<span className="feedback-comment-card__err-message">
								{remarkError}
							</span>
						)}
						<button
							type="button"
							className="feedback-form-card__description-btnSend"
							onClick={handleCheckRemark}
						>
							Отправить
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default inject(({ feedbackStore, auth }) => {
	const { user } = auth;
	const { uid } = user;

	return {
		uid,
		feedbackStore,
	};
})(observer(FeedbackComment));
