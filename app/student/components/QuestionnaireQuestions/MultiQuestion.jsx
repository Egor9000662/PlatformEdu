import React, { useState } from 'react';

export default function MultiQuestion({
	question,
	formData,
	handleChangeData,
	deleteAnswer,
}) {
	const options = question.options;
	const [checkedState, setCheckedState] = useState(
		new Array(options.length).fill(false)
	);

	const handleChecked = (position) => {
		const updatedCheckedState = checkedState.map((item, index) =>
			index === position ? !item : item
		);

		setCheckedState(updatedCheckedState);
		if (updatedCheckedState.length > 0) {
			handleChangeData(question.id, updatedCheckedState);
		} else {
			deleteAnswer(question.id);
		}
	};

	return (
		<div className="questionnaire_multi-q q-question">
			<div>
				<h3 className="q-question__title">{question.title}</h3>
				{question.notice && (
					<p className="q-question__notice">{question.notice}</p>
				)}
			</div>
			<fieldset>
				{options.map((option, index) => {
					return (
						<div
							className="q-question__option"
							key={`${question.id}-${option.id}`}
						>
							<input
								id={`${question.id}-${option.id}`}
								type="checkbox"
								value={option.title}
								onChange={() => handleChecked(index)}
								checked={formData[question.id][index]}
							/>
							<label
								className="q-question__answer-text"
								htmlFor={`${question.id}-${option.id}`}
							>
								{option.title}
							</label>
						</div>
					);
				})}
			</fieldset>
		</div>
	);
}
