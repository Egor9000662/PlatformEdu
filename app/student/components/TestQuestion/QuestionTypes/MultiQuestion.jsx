import React, { useState, useEffect } from 'react';
import { Typography, Form, Checkbox, Radio } from 'antd';
import '../TestQuestion.scss';
import classnames from 'classnames';
import TestNotes from '../TestNotes/TestNotes';
import QuestionBackground from '../QuestionBackground';

export default function MultiQuestion({
	title,
	options,
	imgSrc,
	onChange,
	showAnswer,
	isCorrect,
	getComment,
	setShowAnswer,
}) {
	const onCheckboxChange = (answers) => {
		const result = {};
		answers.forEach((key) => {
			result[key] = true;
		});
		setShowAnswer(
			[...Array(Object.values(options).length)].map((_) => false)
	  )
		onChange(result);
	};
	return (
		<React.Fragment>
			<div className="question">
				<Typography.Title level={5}>{title}</Typography.Title>
				{imgSrc && (
					<div className="question-imagesBlock">
						<img
							src={imgSrc}
							alt="Картинка к тесту"
							className="question-image"
						/>
					</div>
				)}
				<Checkbox.Group onChange={onCheckboxChange}>
					{Object.values(options).map((item, index) => (
						<div
							className={classnames(
								(showAnswer[index] || isCorrect) &&
									(item.isValid
										? 'correct-answer'
										: isCorrect
										? 'wrong-answer-result'
										: 'wrong-answer'),
								'checkbox-one'
							)}
							key={`${item}-${index}`}
						>
							{(showAnswer[index] || isCorrect) && (
								<div className="question-background" />
							)}
							<Form.Item
								className="comment-bg"
								validateStatus="success"
								help={getComment(showAnswer[index], item)}
								key={`${index} - ${item.title}`}
							>
								<Checkbox
									value={index}
									disabled={showAnswer[index] && true}
									className="checkbox-pink"
									style={{ outline: 'none' }}
								>
									{item.title}
								</Checkbox>
							</Form.Item>
						</div>
					))}
				</Checkbox.Group>
				<TestNotes
					notes={'Данный вопрос имеет несколько правильных ответов'}
				/>
			</div>
			<QuestionBackground />
		</React.Fragment>
	);
}
