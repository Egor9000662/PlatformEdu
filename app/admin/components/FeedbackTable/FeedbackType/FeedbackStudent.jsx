import React, { useState } from 'react';

function FeedbackStudent({ studentId, adminFeedbackModel }) {
	const [isLessonFeedback, setIsLessonFeedback] = useState(true);
	const feedbackType = isLessonFeedback ? 'theme' : 'hometask';
	const currentFeedback = adminFeedbackModel.getStudentFeedbackDataById(studentId, feedbackType);

	const handleShowRewiew = () => {
		setIsLessonFeedback(!isLessonFeedback);
	};

	return (
		<div className="feedbackTable-student">
			<div className="fI-checkbox">
				<div className="fI-checkbox-title">Оценка уроков</div>
				<div className="feedbackInfo-checkbox">
					<input
						type="checkbox"
						className="fI-slider"
						onChange={handleShowRewiew}
					/>
				</div>
				<div className="fI-checkbox-title">Проверка домашки</div>
			</div>
			<>
				<div className="feedback-card">
					<div className="feedback-card__name">{isLessonFeedback ? 'Оценка уроков' : 'Проверка домашки'}</div>
					{currentFeedback !== '' && currentFeedback.length === 0 && (
						<div className="feedbackInfoCard-empty">
							<h1 className="fICard-empty">
								{' '}
								Отзывы отсутствуют
							</h1>
						</div>
					)}
					{currentFeedback.map((feedback) => (
						<div
							className="feedback-card__body"
							key={`${feedback.id}`}
						>
							<p className="feedback-name">{feedback.title}</p>
							<div className="feedback-hometaskFields">
								<p>
									<b>Качество:</b> {feedback.quality}
								</p>
								{feedbackType === 'theme' && (
									<p>
										<b>Сложность:</b> {feedback.difficulty}
									</p>
								)}
							</div>
							{feedback.comment && (
								<p>
									<b>Замечания</b>: {feedback.comment}
								</p>
							)}
						</div>
					))}
				</div>
			</>
		</div>
	);
}

export default FeedbackStudent;
