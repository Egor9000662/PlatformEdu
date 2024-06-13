import React from "react";
import "./LessonCard.scss";

export default function LessonCard({ title, description, lessonNumber }) {
	return (
		<div className="w-card">
			<div className="w-card__header-wrap">
				<div className="w-card__header">
					{`Неделя ${lessonNumber}: ${title}`}
				</div>
			</div>
			<div className="w-card__description">{description}</div>
		</div>
	);
}
