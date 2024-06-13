import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import Button from '../../../common/components/Button/Button';
import './TestQuestion.scss';
import classnames from 'classnames';
import buttonSmallBlob from '../../assets/testBtnBlobs/buttonSmallBlob.svg';
import buttonBigBlob from '../../assets/testBtnBlobs/buttonBigBlob.svg';
import TestHearts from './TestHearts/TestHearts';
import QuestionResultMessage from './QuestionResultMessage';

export default function QuestionFooter({
	testId,
	lessonId,
	currentIndex,
	length,
	wrongResult,
	isCorrect,
	mistakes,
	nextTest,
	isFailed,
}) {
	const {course:courseName} =useParams();
	return (
		<div className="test-bottom">
			{isCorrect || wrongResult
				? <QuestionResultMessage isCorrect={isCorrect} />
				: null
			}
			<div className="buttonHeart">
				{currentIndex === length && isCorrect ? (
					<Link
						to={{
							pathname: `/${courseName}/${testId}/test-results`,
							state: { lessonId: lessonId, amount: length, course: courseName },
						}}
					>
						<Button
							className="test-result-btn"
							text="Узнать результат"
						/>
					</Link>
				) : (
					<Button
						type="submit"
						onClick={nextTest}
						text={isCorrect ? 'Далее' : 'Ответить'}
						className={classnames(
							wrongResult && 'answer-btn-disabled',
							'answer-btn'
						)}
					/>
				)}
				<div className="heartIcon">
					<TestHearts mistakesNum={mistakes} isFailed={isFailed} />
				</div>
			</div>
		</div>
	);
}
