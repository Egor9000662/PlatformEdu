import React from "react";
import SoloQuestion from "./QuestionTypes/SoloQuestion";
import MultiQuestion from "./QuestionTypes/MultiQuestion";

const getComment = (showAnswer, item) => {
	let comment = null;

	if (showAnswer) {
		comment = item.comment || "";
	}

	return comment;
};

export default function QuestionBody({ type, testProps }) {
	let component = null;

	if (type === "multi") {
		component = <MultiQuestion {...testProps} getComment={getComment} />;
	} else if (type === "solo") {
		component = <SoloQuestion {...testProps} getComment={getComment} />;
	} else {
		component = testProps.title;
	}

	return component;
}
