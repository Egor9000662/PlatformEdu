import React, { useState } from 'react';
import './ThemeFeedback.scss';
import StarRating from '../../../../common/components/StarsRating/StarRating';
import ThemeFeedbackComment from './ThemeFeedbackComment';

export default function ThemeFeedback({
	taskId,
	feedbackSent,
	title,
	sendFeedback,
	uid,
}) {
	const [feedbackDifficulty, setFeedbackDifficulty] = useState(0);
	const [feedbackQuality, setFeedbackQuality] = useState(0);
	const [remarkNeeded, setRemarkNeeded] = useState(false);
	const [feedbackSentFlag, setFeedbackSentFlag] = useState(false);
	const feedbackType = 'theme';

	const handleChangeQuality = (quality) => {
		setFeedbackQuality(quality);
	};

	const handleChangeDifficulty = (difficulty) => {
		setFeedbackDifficulty(difficulty);
	};

	const handleCheckStars = () => {
		if (feedbackDifficulty === 0 || feedbackQuality === 0) {
			return;
		}
		if (feedbackDifficulty > 3 || feedbackQuality < 5) {
			setRemarkNeeded(true);
		}
		if (feedbackDifficulty <= 3 && feedbackQuality === 5) {
			handleSendFeedback();
		}
	};
	const handleSendFeedback = () => {
		const feedbackRemarkValue = '';
		sendFeedback(
			uid,
			taskId,
			feedbackType,
			feedbackRemarkValue,
			feedbackQuality,
			feedbackDifficulty,
			title
		);
		setFeedbackSentFlag(true);
	};
	return (
		<div className="tf-container">
			<div className="themeFeedbackWrapper">
				<h2 className="tf-title">Отзыв об уроке</h2>
				{feedbackSentFlag || feedbackSent ? (
					<h3 className="tf-title">Спасибо за ваш отзыв!</h3>
				) : (
					<>
						{!remarkNeeded ? (
							<>
								<div>
									<span className="tf-title">
										Качество урока
									</span>
								</div>
								<div>
									<StarRating
										numTotalStars="5"
										initialRating={feedbackQuality}
										starsFor="difficulty"
										onChangeDifficulty={handleChangeQuality}
									/>
								</div>
								<div>
									<span className="tf-title">
										Сложность урока
									</span>
								</div>
								<div>
									<StarRating
										numTotalStars="5"
										initialRating={feedbackDifficulty}
										starsFor="difficulty"
										onChangeDifficulty={
											handleChangeDifficulty
										}
									/>
								</div>
								<div>
									<button
										type="button"
										className="feedback-form-card__description-btnSend"
										onClick={handleCheckStars}
									>
										Отправить
									</button>
								</div>
							</>
						) : (
							<ThemeFeedbackComment
								feedbackType={feedbackType}
								title={title}
								feedbackDifficulty={feedbackDifficulty}
								feedbackQuality={feedbackQuality}
								uid={uid}
								taskId={taskId}
								sendFeedback={sendFeedback}
								setFeedbackSentFlag={setFeedbackSentFlag}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
}
