import React from 'react';

function FeedbackVideo({ feedback }) {
	return (
		<>
			<div key={feedback.id} className="feedback-video">
				<h3>Тема: {feedback.title} </h3>
				<p>
					<b>Качество:</b> {feedback.quality}
				</p>
				{feedback.comment && (
					<div>
						<b>Замечания</b>: {feedback.comment}
					</div>
				)}
			</div>
		</>
	);
}

function FeedbackMentors({ mentorId, adminFeedbackModel }) {
	const allFeedback = adminFeedbackModel.getMentorFeedbackDataById(mentorId);
	const { meetingsAverage, hometaskAverage } = adminFeedbackModel.getFeedbackAverage(allFeedback);

	return (
		<div className="feedbackTable-mentor">
			<div className="feedback-cards">
				<div className="fI-average-container feedback-card">
					<div className="feedback-card__name">
						Среднее значение:{' '}
					</div>
					<div className="feedback-card__body">
						<p>
							<span>{meetingsAverage}</span> созвоны
						</p>
						<p>
							<span>{hometaskAverage}</span> работа с дз
						</p>
					</div>
				</div>
			</div>
			<div className="feedback-cards">
				{allFeedback.map((f) => (
					<div className="feedback-card" key={f.name}>
						<div className="feedback-card__name">{f.name} </div>
						{adminFeedbackModel.getMeetingsFeedbacks(f.feedback)
							.map((item) => {
								const feedback = item.feedback;
								return feedback?.map((f) => (
									<div
										className="feedback-card__body"
										key={`${f.id}-${f.quality}`}
									>
										<p className="feedback-name">{f.id}</p>
										<FeedbackVideo feedback={f} />
									</div>
								));
							})}
					</div>
				))}
			</div>
		</div>
	);
}

export default FeedbackMentors;
