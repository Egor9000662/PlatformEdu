import React from "react";
import "./CourseCard.scss";
import Card from "../../../common/components/Card/Card";

export default function CourseCard({
	title,
	description,
	lessonNumber,
	selected,
}) {
	return (
		<>
			{/* {selected && 'NOW'} */}
			<Card
				title={`Неделя ${lessonNumber}: ${title}`}
				description={description}
			/>
		</>
	);
}
