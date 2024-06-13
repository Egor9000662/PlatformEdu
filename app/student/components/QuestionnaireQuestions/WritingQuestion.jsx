import React, { useState } from 'react';

export default function WritingQuestion({
	question,
	formData,
	handleChangeData,
	deleteAnswer,
}) {
	const [isValid, setIsValid] = useState(true);
	const [emailValid, setEmailValid] = useState(true);

	const emailQuestion = question.title.includes('email');

	const checkAnswer = (evt) => {
		const answer = evt.target.value;
		emailQuestion && checkEmail(answer);
		if (answer !== '' && emailValid) {
			setIsValid(true);
			handleChangeData(question.id, answer);
		} else {
			setIsValid(false);
			deleteAnswer(question.id);
		}
	};

	const checkEmail = (answer) => {
		const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
		if (answer.match(regex)) {
			setEmailValid(true);
		} else {
			setEmailValid(false);
		}
	};

	return (
		<div className="questionnaire_write-q q-question">
			<label htmlFor={question.id}>
				<h3 className="q-question__title">{question.title}</h3>
				{question.notice && (
					<p className="q-question__notice">{question.notice}</p>
				)}
			</label>
			<input
				className={isValid
					? 'q-question__answer'
					: 'q-question__answer invalid-answer'}
				id={question.id}
				name={question.id}
				type={question.answerType === 'number' ? 'number' : 'text'}
				min={question.answerType === 'number' ? '16' : null}
				max={question.answerType === 'number' ? '100' : null}
				onBlur={checkAnswer}
				value={formData[question.id]}
				onChange={(e) => { handleChangeData(question.id, e.target.value) }}
			/>

			{emailQuestion && !emailValid && (
				<p className="questionnaire-error"> Неверный формат почты</p>
			)}
		</div>
	);
}
