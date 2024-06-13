import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import './TestQuestion.scss';
import ProgressBar from '../../../common/components/ProgressBar/ProgressBar';
import isValidAnswer from '../../../modules/js-functions';
import QuestionBody from './QuestionBody';
import QuestionFooter from './QuestionFooter';
import { useLocation } from "react-router-dom";
import Test from "../../models/Test";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { generatePath } from "react-router-dom";
import { notionPagePath } from "../../pages/App/App";

const TestQuestion = ({
	question,
	questionId,
	testId,
	weekId,
	setCurrentIndex,
	currentIndex,
	length,
	numberOfCorrectAnswers,
	setNumberOfCorrectAnswers,
	userId,
	progressStore,
	test,
	setAnswers,
	answers,
}) => {
	const [userAnswer, setUserAnswer] = useState({});
	const [showAnswer, setShowAnswer] = useState(
		[...Array(Object.values(question.options).length)].map((_) => false)
	);
	const [isCorrect, setIsCorrect] = useState(null);
	const [wrongResult, setWrongResult] = useState(false);
	const [mistakes, setMistakes] = useState(0);

	let imgSrc = '';
	if (question.image) {
		imgSrc = question.image;
	}

	useEffect(() => {
		let timerWrong = setTimeout(() => {
			setWrongResult(false);
			if (
				Object.values(question.options).length === Object.keys(userAnswer).length
			) {
				setShowAnswer(
					[...Array(Object.values(question.options).length)].map((_) => false)
				);
			}
		}, 3000);

		return () => clearTimeout(timerWrong);
	}, [wrongResult]);


	const onChange = (answer) => {
		setUserAnswer(answer);
	};

	const onCheckAnswer = (e) => {
		e.preventDefault();

		if (Object.keys(userAnswer).length === 0) {
			return;
		}
		const result = isValidAnswer(question.options, userAnswer);
		setIsCorrect(result);

		!result && setWrongResult(true);
		if (!result) {
			setMistakes((prev) => prev + 1);
			setNumberOfCorrectAnswers(-1);
		} else {
			setNumberOfCorrectAnswers(prev => prev + 1);
		}

		setShowAnswer(
			showAnswer.map((item, i) =>
				e.target[i].checked || result ? true : item
			)
		);

		setAnswers([...answers, {
			userAnswer: result,
			mistakes: mistakes,
		}]);

		const lastQuestion = length - 1;
		if (questionId === lastQuestion) {
			test.saveTestProgressToBD([...answers, {
				userAnswer: result,
				mistakes: mistakes,
			}], testId, userId, questionId)
		}
	};

	const nextTest = () => {
		if (isCorrect) {
			setCurrentIndex(currentIndex + 1);
		}
	};
	return (
		<>
			<div className="test-header">
				<BackArrow
					className="test-header-button"
				// path={generatePath(notionPagePath, {course, id: weekId})}
				/>
				<div>
					{isCorrect && numberOfCorrectAnswers !== 0 && numberOfCorrectAnswers !== 1
						? <div className='test-header-achievement'>
							Молодец! {numberOfCorrectAnswers} правильных ответа подряд!
						</div>
						: null
					}
					{isCorrect === false
						? <div className='test-header-achievement'>
							Не расстраивайся! Ошибки - это нормально!
						</div>
						: null
					}
					<ProgressBar
						item={currentIndex - 1}
						amount={length}
					></ProgressBar>
				</div>
				<div className="test-header-counter">
					{currentIndex}/{length}
				</div>
			</div>
			<form className="test-form" onSubmit={onCheckAnswer}>
				<QuestionBody
					type={question.type}
					testProps={{
						title: question.title,
						imgSrc,
						options: question.options,
						showAnswer,
						onChange,
						isCorrect,
						setShowAnswer,
					}}
				/>
				<QuestionFooter
					testId={testId}
					lessonId={weekId}
					currentIndex={currentIndex}
					length={length}
					wrongResult={wrongResult}
					isCorrect={isCorrect}
					mistakes={mistakes}
					nextTest={nextTest}
					isFailed={test.isFailed(testId)}
				/>
			</form>
		</>
	);
};

export default inject(({ auth, progressStore, groupsStore, oneGroupStore }) => {
	const { group } = auth.profile;
	const location = useLocation();
	useEffect(() => {
		progressStore.getProgress(auth.user.uid);
		oneGroupStore.id = group;
		oneGroupStore.loadData()
	}, [auth.user.uid]);

	const test = new Test(groupsStore, location.state.lessonId, group, progressStore);

	return {
		userId: auth.user.uid,
		progressStore,
		test,
	};
})(observer(TestQuestion));
