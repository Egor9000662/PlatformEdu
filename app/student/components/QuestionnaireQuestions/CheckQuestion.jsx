import React, { useState } from 'react';

export default function CheckQuestion({
	question,
	formData,
	handleChangeData,
	deleteAnswer,
}) {
	const options = question.options;
	const [isOther, setIsOther] = useState(false);
	const [isValid, setIsValid] = useState(true);
	const inputClassName = isValid
		? 'q-question__answer'
		: 'q-question__answer invalid-answer';

	const handleChecked = (evt) => {
		const answer = evt.target.value;

		if (answer === 'Иное') {
			setIsOther(true);
			handleChangeData(question.id, '');
		} else {
			setIsOther(false);
			handleChangeData(question.id, answer);
		}
	};

	const checkTextAnswer = (evt) => {
		const answer = evt.target.value;
		if (answer !== '') {
			setIsValid(true);
			handleChangeData(question.id, answer.trim());
		} else {
			setIsValid(false);
			deleteAnswer(question.id);
		}
	};

	return (
		<div className="questionnaire_check-q q-question">
			<div>
				<h3 className="q-question__title">{question.title}</h3>
				{question.notice && (
					<p className="q-question__notice">{question.notice}</p>
				)}
			</div>
			<fieldset>
				{options.map((option) => {
					return (
						<div key={`${question.id}-${option.id}`}>
							<div className="q-question__option">
								<input
									id={`${question.id}-${option.id}`}
									type="radio"
									name={question.id}
									value={option.title}
									onChange={(e)=>handleChecked(e)}
									checked={formData[question.id] === option.title}
								/>
								<label
									className="q-question__answer-text"
									htmlFor={`${question.id}-${option.id}`}
								>
									{option.title}
								</label>
							</div>
							{option.id === 'other' && isOther ? (
								<p>
									<input
										className={inputClassName}
										type="text"
										onBlur={checkTextAnswer}
									/>
								</p>
							) : (
								''
							)}
						</div>
					);
				})}
			</fieldset>
		</div>
	);
}
