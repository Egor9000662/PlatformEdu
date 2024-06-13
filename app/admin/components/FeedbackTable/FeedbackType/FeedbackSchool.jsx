import React from 'react';
import { Progress } from 'antd';

function FeedbackSchool({ adminFeedbackModel }) {
	const { allFeedback, qualityAverage, recAverage } = adminFeedbackModel.schoolFeedbackData;

	const handleClassName = (feedback) => {
		let className = 'feedback-card__body';
		if (feedback.quality === 1 || !feedback.recommended)
			className += ' negativeFeedback';
		return className;
	};

	return (
		<div className="feedbackTable-school">
			<div className="feedback-cards">
				<div className="fI-average-container feedback-card">
					<div className="fI-average-recAmount">
						<Progress
							type="circle"
							percent={recAverage}
							status={'normal'}
							width={100}
						/>
						<p>
							Количество рекомендующих платформу из оставивших
							отзывы
						</p>
					</div>
					<div className="fI-average-quality">
						<span>{qualityAverage}</span>
						<p>Средняя оценка качества школы</p>
					</div>
				</div>
			</div>
			<div className="feedback-cards">
				{allFeedback?.map((f) => (
					<div className="feedback-card" key={f.name}>
						<div className="feedback-card__name">{f.name} </div>
						{f.feedback.reverse().map((item) => {
							return (
								<div
									className={handleClassName(item)}
									key={item.quality + Math.random()}
								>
									<div className="school-stats">
										<p>Оценка: {item.quality}</p>
										<p>
											{item.recommended === 'true'
												? 'Рекомендует'
												: 'Не рекомендует'}
										</p>
									</div>
									{item.comment && <p>{item.comment}</p>}
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}

export default FeedbackSchool;
