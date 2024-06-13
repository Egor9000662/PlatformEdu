import React, { useState, useEffect } from 'react';
import './FeedbackForm.scss';
import StarRating from '../../../../common/components/StarsRating/StarRating';
import { inject, observer } from 'mobx-react';
import { Radio } from 'antd';

function FeedbackForm({
	uid,
	id,
	feedbackStore,
	feedbackType,
	onChangeRemarkNeeded,
	onChangeQuality,
	onChangeDifficulty,
	onChangeRecommended,
	title,
	mentorUid,
	setFeedbackSentFlag,
	showEstimationModalForm,
}) {
	const [feedbackName, setFeedbackName] = useState('');
	const [feedbackQuality, setFeedbackQuality] = useState(0);
	const [feedbackDifficulty, setFeedbackDifficulty] = useState(0);
	const [showErr, setShowErr] = useState(false);
	const [recommended, setRecommended] = useState(false);
	const remarkError = 'Пожалуйста, заполни все поля';

	useEffect(() => {
		if (feedbackType === 'hometask') {
			setFeedbackName('проверки домашнего задания');
			setFeedbackDifficulty(5);
			setRecommended(true);
		}
		if (feedbackType === 'meeting') {
			setFeedbackName('созвона');
		}
		if (feedbackType === 'school') {
			setFeedbackName('школы и платформы');
			setFeedbackDifficulty(5);
		}
		if (feedbackType === 'theme') {
			setFeedbackName('урока');
		}
	}, []);

	const handleChangeQuality = (quality) => {
		setFeedbackQuality(quality);
		onChangeQuality(quality);
	};

	const handleChangeDifficulty = (difficulty) => {
		setFeedbackDifficulty(difficulty);
		onChangeDifficulty(difficulty);
	};

	const handleChangeRecommended = (e) => {
		setRecommended(e.target.value);
		onChangeRecommended(e.target.value);
	};

	const handleCheckStars = () => {
		if (feedbackDifficulty === 0 || feedbackQuality === 0) {
			return;
		}
		if (feedbackDifficulty < 5 || (feedbackQuality < 5 && recommended)) {
			onChangeRemarkNeeded(true);
		}
		if (feedbackDifficulty === 5 && feedbackQuality === 5 && recommended) {
			handleSendFeedback();
		}
		if (!recommended) setShowErr(true);
	};

	const handleSendFeedback = () => {
		const feedbackRemarkValue = '';
		const videoId = '';
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
			<div
				className={
					feedbackType === 'theme' || feedbackType === 'school'
						? 'feedback-form-border ff-card'
						: 'feedback-form-border ff-card-small'
				}
			>
				<div
					className={
						feedbackType === 'theme' || feedbackType === 'school'
							? 'feedback-form-card ff-card'
							: 'feedback-form-card ff-card-small'
					}
				>
					<div className="feedback-form-card__description">
						<div className="feedback-form-card__description-appraise">
							Оцени качество {feedbackName}
						</div>
						<StarRating
							numTotalStars="5"
							initialRating={feedbackQuality}
							starsFor="quality"
							onChangeQuality={handleChangeQuality}
						/>
						{feedbackType === 'theme' && (
							<>
								<div className="feedback-form-card__description-appraise">
									Оцени сложность урока
								</div>
								<StarRating
									numTotalStars="5"
									initialRating={feedbackDifficulty}
									starsFor="difficulty"
									onChangeDifficulty={handleChangeDifficulty}
								/>
							</>
						)}
						{feedbackType === 'school' && (
							<div className="feedback-school-form-card__container">
								<div>Рекомендуешь ли ты нашу школу?</div>
								<Radio.Group
									name="radiogroup"
									onChange={handleChangeRecommended}
									defaultValue="a"
								>
									<Radio value="true">Да</Radio>
									<Radio value="false">Нет</Radio>
								</Radio.Group>
							</div>
						)}
						{showErr && (
							<span className="feedback-comment-card__err-message">
								{remarkError}
							</span>
						)}
						<button
							type="button"
							className="feedback-form-card__description-btnSend"
							onClick={handleCheckStars}
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
	const { uid } = auth.user;

	return {
		uid,
		feedbackStore,
	};
})(observer(FeedbackForm));
