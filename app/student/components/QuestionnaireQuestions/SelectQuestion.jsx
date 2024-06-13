import React, { useState } from 'react';
import selectCheckmark from '../../../common/assets/controls/select_checkmark.svg';

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
            <div>
                <div className="q-question__option">
                    <div className='q-question__option-selectContainer'>
                        <select
                            className="q-question__option-select"
                            name={question.id}
                            value={formData[question.id]}
                            onChange={(e) => handleChecked(e)}
                        >
                            <option value="" defaultValue>
                                {question.title}
                            </option>
                            {options
                                .map((option) => (
                                    <option key={option.id} value={option.title} id={`${question.id}-${option.id}`}>
                                        {option.title}
                                    </option>
                                ))}
                        </select>
                        <div className="q-question__option-selectCheckMark" >
                            <img src={selectCheckmark} />
                        </div>
                    </div>
                </div>
                {isOther && (
                    <p>
                        <input
                            className={inputClassName}
                            type="text"
                            onBlur={checkTextAnswer}
                        />
                    </p>
                )}
            </div>
        </div>
    );
}
