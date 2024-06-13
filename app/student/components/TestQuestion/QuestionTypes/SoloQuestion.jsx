import React from "react";
import { Typography, Form, Radio } from "antd";
import "../TestQuestion.scss";
import classnames from "classnames";
import QuestionBackground from "../QuestionBackground";

export default function SoloQuestion({
	title,
	options,
	imgSrc,
	onChange,
	showAnswer,
	isCorrect,
	getComment,
}) {
	const onRadioChange = (e) => {
		const result = { [e.target.value]: true };
		onChange(result);
	};
	return (
		<React.Fragment>
			<QuestionBackground />
			<div className="question">
				<Typography.Title level={5} className="title">
					{title}
				</Typography.Title>
				{imgSrc && (
					<div className="question-imagesBlock">
						<img
							src={imgSrc}
							alt="Картинка к тесту"
							className="question-image"
						/>
					</div>
				)}
				<Radio.Group onChange={onRadioChange}>
					{Object.values(options).map((item, index) => (
						<div
							key={index}
							className={classnames(
								(showAnswer[index] || isCorrect) &&
									(item.isValid
										? "correct-answer"
										: isCorrect
										? "wrong-answer-result"
										: "wrong-answer"),
								"radio-one"
							)}
						>
							{(showAnswer[index] || isCorrect) && (
								<div className="question-background" />
							)}
							<Form.Item
								className="comment-bg"
								validateStatus="success"
								help={getComment(showAnswer[index], item)}
								key={index - item.title}
							>
								<Radio
									className="radio-pink"
									value={index}
									disabled={showAnswer[index] && true}
								>
									{item.title}
								</Radio>
							</Form.Item>
						</div>
					))}
				</Radio.Group>
			</div>
		</React.Fragment>
	);
}
