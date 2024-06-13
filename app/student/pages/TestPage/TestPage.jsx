import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import TestQuestion from '../../components/TestQuestion/TestQuestion';
import './TestPage.scss';
import { useLocation } from 'react-router-dom';

const TestPage = ({ lessonsStore, defaultId, location}) => {
	const { id = defaultId } = useParams();
	const [test, setTest] = useState(null);
	const [currentIndex, setCurrentIndex] = useState(1);
	const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
	const [answers, setAnswers] = useState([])

	useEffect(async () => {
		const result = await lessonsStore.getTest(location.state.course, id);
		setTest(result);
	}, [id]);
	if (!test) {
		return null;
	}
	const { length } = Object.values(test.questions);
	const questionId = currentIndex - 1;
	const question = test.questions[questionId];
	const week = location.state.weekId || localStorage.getItem('state');
	return (
		<div className="testPage-container">
			<div className="testPage">
				<TestQuestion
					question={question}
					key={questionId}
					questionId={questionId}
					testId={test.id}
					weekId={week}
					setCurrentIndex={setCurrentIndex}
					currentIndex={currentIndex}
					length={length}
					numberOfCorrectAnswers={numberOfCorrectAnswers}
					setNumberOfCorrectAnswers={setNumberOfCorrectAnswers}
					setAnswers={setAnswers}
					answers={answers}
				/>
			</div>
		</div>
	);
};

export default inject(({ lessonsStore }) => {
	const location = useLocation();

	return {
		lessonsStore,
		location,
	};
})(observer(TestPage));
