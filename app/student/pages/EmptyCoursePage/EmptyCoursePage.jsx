import React from 'react';
import Cat from '../../assets/onboarding/gumball.svg';
import './EmptyCoursePage.scss';

function EmptyCoursePage() {
	return (
		<div className="emptyCourse-body">
			<img className="emptyCourse-img" src={Cat} alt="catImg" />
			<h2 className="emptyCourse-text">
				Привет! Совсем скоро ты сможешь начать свое обучение. Подожди
				еще немного пока тебя добавят в группу и наступит дата начала
				твоего обучения
			</h2>
		</div>
	);
}

export default EmptyCoursePage;
