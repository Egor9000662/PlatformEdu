import React from 'react';

function FeedbackLesson({ courseInfo, adminFeedbackModel }) {
	const currentThemes = adminFeedbackModel.getCurrentThemes(courseInfo);
	adminFeedbackModel.getFeedbackByTheme(currentThemes, courseInfo.course);

	return (
		<div className="feedbackTable-container">
			<>
				<div className="feedback-card">
					{currentThemes.length === 0 && (
						<div className="feedbackInfoCard-empty">
							<h1 className="fICard-empty">
								{' '}
								Отзывы отсутствуют
							</h1>
						</div>
					)}
					{currentThemes
						.map((feedback) => (
							<div
								className="feedback-card__body"
								key={`${feedback.id}`}
							>
								<p className="feedback-name">{feedback.name}</p>
								<div className="feedback-hometaskFields">
									<p>
										<b>Качество:</b>{' '}
										{adminFeedbackModel.calculateAverageLesson(
											feedback.quality,
											feedback.amount
										)}
									</p>
									<p>
										<b>Сложность:</b>{' '}
										{adminFeedbackModel.calculateAverageLesson(
											feedback.difficulty,
											feedback.amount
										)}
									</p>
								</div>
							</div>
						))}
				</div>
			</>
		</div>
	);
}

export default FeedbackLesson;
