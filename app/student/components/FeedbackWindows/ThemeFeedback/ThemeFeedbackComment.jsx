import React, { useState } from "react";
import "./ThemeFeedbackComment.scss";

export default function ThemeFeedbackComment({
	uid,
	taskId,
	sendFeedback,
	feedbackType,
	feedbackQuality,
	feedbackDifficulty,
	title,
	setFeedbackSentFlag,
}) {
	const [feedbackRemarkValue, setFeedbackRemarkValue] = useState("");
	const [showErr, setShowErr] = useState(false);
	const remarkError =
		"Пожалуйста, поделись с нами дополнительной информацией";

	const handleChangeFeedbackRemark = (e) => {
		setFeedbackRemarkValue(e.target.value);
		setShowErr(false);
	};

	const handleCheckRemark = () => {
		if (feedbackRemarkValue !== "") {
			handleSendFeedback();
		}
		if (feedbackRemarkValue === "") setShowErr(true);
	};

	const handleSendFeedback = () => {
		sendFeedback(
			uid,
			taskId,
			feedbackType,
			feedbackRemarkValue,
			feedbackQuality,
			feedbackDifficulty,
			title
		);
		setFeedbackSentFlag(true);
	};

	return (
		<div className="feedback-theme-form-container">
			<h2>Тебе что-то не понравилось?</h2>
			{feedbackType !== "hometask" && <h2> Что вызвало трудности?</h2>}
			<textarea
				className="feedback-theme-form_comment"
				placeholder="Твой отзыв"
				value={feedbackRemarkValue}
				onChange={handleChangeFeedbackRemark}
			/>
			{showErr && (
				<span className="feedback-comment-card__err-message">
					{remarkError}
				</span>
			)}
			<button
				type="button"
				className="feedback-form-card__description-btnSend"
				onClick={handleCheckRemark}
			>
				Отправить
			</button>
		</div>
	);
}