import React from 'react';
import { useState, useEffect } from 'react';
import { v4 } from 'uuid';

function MentorLow({ feedbackInfo, name }) {
	return (
		<>
			{feedbackInfo.length > 0 && (
				<div className="feedback-card">
					<div
						className="feedback-card__body"
						key={v4()}
					>
						<p className="feedback-name">{name}</p>
						{feedbackInfo.map((item) => {
							const commentsInfo = [item.feedback].flat();
							return (
								<div key={item.week}>
									<p>
										<b>Неделя:</b> {item.week}
									</p>
									<ul className="feedback-commentsList">
										<b>Комментарии:</b>
										{commentsInfo &&
											commentsInfo.map((f) => {
												return (
													<li key={v4()}>
														{f.comment}({f.title})
													</li>
												);
											})}
									</ul>{' '}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}
function ThemeLow({ comments, title }) {
	return (
		<div className="feedback-card">
			<div
				className="feedback-card__body"
				key={v4()}
			>
				<p className="feedback-name">{title}</p>
				<ul className="feedback-commentsList">
					<b>Комментарии:</b>{' '}
					{comments.map((comment) => {
						return <li key={v4()}>{comment}</li>;
					})}
				</ul>
			</div>
		</div>
	);
}

function FeedbackLow({
	feedbackInfo,
	filterBy,
	adminFeedbackModel
}) {
	const [lowFeedback, setLowFeedback] = useState([]);

	const findLowFeedback = () => {
		const lowFB = adminFeedbackModel.findLowFeedback(filterBy);
		setLowFeedback(lowFB);
	};

	useEffect(() => {
		findLowFeedback();
	}, [feedbackInfo]);

	return (
		<div className="feedbackTable-container">
			<>
				{lowFeedback &&
					lowFeedback.flat().map((feedback) => {
						if (filterBy === 'meeting') {
							if (feedback.feedback) {
								return (
									<MentorLow
										key={feedback.uid}
										feedbackInfo={feedback.feedback}
										name={feedback.name}
									/>
								);
							}
						} else
							return (
								<ThemeLow
									key={feedback.id + v4()}
									comments={[feedback.comment]
										.flat()
										.filter((item) => item !== undefined)}
									title={feedback.title}
								/>
							);
					})}
			</>
		</div>
	);
}

export default FeedbackLow;
