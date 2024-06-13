import React, { useEffect, useState } from 'react';
import './TestResult.scss';
import Counter from '../../../common/components/Counter/Counter';
import HardSkills from '../../../common/assets/сrystals/crystallHardSkills.svg';
import {generatePath, Link} from 'react-router-dom';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useParams } from 'react-router-dom';
import TestAchievement from "../Achievement/TestAchievement/TestAchievement";
import {notionPagePath} from "../../pages/App/App";
import Test from "../../models/Test";

function TestResult({ location, test }) {
	const { course, testId } = useParams();
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [isMistake, setIsMistake] = useState(false);

	const handleCount = () => {
		let correctAnswersCount = test.getCount(testId, setIsMistake)
		setCorrectAnswers(correctAnswersCount);
	};
	useEffect(() => {
		handleCount();
	}, [test.getQuestions(testId)]);

	const isPassed = test.isFailed(testId) ? false : test.getPassed(location.state.amount, correctAnswers);
	const crystalNum = isPassed && !test.deadlineOverdue ? 1 : 0;
	const textRes = isPassed ? 'Молодец! Пройдено' : 'Попробуй снова';
	return (
		<>
			{correctAnswers === location.state.amount && !isMistake
				? <TestAchievement
					weekId={location.state.lessonId}
					crystalNum={crystalNum}
					deadlineOverdue={test.deadlineOverdue}
					text='Ты прошла тест без ошибок, молодец!'
				/>
				:
				<div className="test-result-wrapper">
					<div className="test-result-window">
						<div className="wrapper">
							<div className="test-result__top-line">
								<div className="test-result__crystal">
									<div className="crystals-amount">
										<img src={HardSkills} alt="hard-skills" />
										{crystalNum}
									</div>
								</div>
							</div>

							<div className="test-result__phrase">
								{textRes}
							</div>
							<div className="test-result__counter">
								<Counter
									num={`${correctAnswers}/${location.state.amount} `}
									test={true}
								/>
							</div>
							<div className="test-result__btns">
								<Link
									to={{
										pathname: generatePath(notionPagePath, {course, id: location.state.lessonId}),
									}}
								>
									<button className="sendBtn1" type="submit">
										К уроку
									</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			}
		</>
	);
}
export default inject(({ progressStore, auth, groupsStore }) => {
	const { group } = auth.profile;
	const location = useLocation();
	const test = new Test(groupsStore, location.state.lessonId, group, progressStore);
	return {
		location,
		test,
	};
})(observer(TestResult));
