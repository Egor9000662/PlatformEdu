import React from 'react';
import BackArrow from '../../../../common/components/BackArrow/BackArrow';
import Cat from '../../../assets/onboarding/gumball.svg';
import './BlockedLessonPage.scss';

function BlockedLessonPage() {
	const pathName = localStorage.getItem('pathName');
	return (
		<div className="blockedLesson-container">
			<div className="blockedLesson-header">
				<BackArrow pathName={pathName} />
			</div>
			<div className="blockedLesson-body">
				<img className="blockedLesson-img" src={Cat} alt="catImg" />

				<h2 className="blockedLesson-text">
					Не торопись! Ты пока не можешь приступить к этому уроку
				</h2>
				<p className="blockedLesson-text">
					Если эта страница показана по ошибке - перезагрузи страницу
					или обратись к наставнице для получения доступа
				</p>
			</div>
		</div>
	);
}

export default BlockedLessonPage;
