import React from "react";

export default function QuestionResultMessage({ isCorrect }) {
	return (
		<>
			{isCorrect
				?<p className="correct">
					Верно! <br />{" "}
					<span className="additional-text">Продолжай в том же духе</span>
				</p>
				:<p className="wrong">
					Не верно! <br />{" "}
					<span className="additional-text">Попробуй еще раз</span>
				</p>
			}
		</>
	)
}
