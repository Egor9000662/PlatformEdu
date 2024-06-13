import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './QuestionnaireModal.scss';

const QuestionnaireModal = ({ studentData, questionnaire, requiresQuestionnaire }) => {
	const  onboardingDone = studentData.studentData.status.name !== "new";
	const [isVisible, setIsVisible] = useState(false);
// 	const avatar = localStorage.getItem('avatar');

	useEffect(() => {
		if (!questionnaire?.workspace) {
			return;
		}
		// if (onboardingDone && avatar) {
		if (onboardingDone && requiresQuestionnaire && !questionnaire?.workspace?.questionnaireDone) {
			setIsVisible(true);
		}
	// }, [onboardingDone, avatar]);
	}, [onboardingDone, questionnaire, requiresQuestionnaire ]);

	return (
		<Modal open={isVisible} footer={null} className="questionnaire-modal">
			<div>
				<p> Остался последний шаг, и ты сможешь приступить к освоению нового!</p>
				<p>
					Заполни, пожалуйста, анкету. Помоги нам узнать тебя лучше!
				</p>
				<Link to={'/questionnaire'} onClick={() => setIsVisible(false)}>
					<button className=" primary greenBtn">Перейти</button>
				</Link>
			</div>
		</Modal>
	);
};

export default QuestionnaireModal;
