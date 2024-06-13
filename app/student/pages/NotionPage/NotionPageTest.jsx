import {Link, useParams} from "react-router-dom";
import React from "react";
import './NotionPageTest.scss';

function NotionPageTest(props) {

	const {testId, lessonId, handleQuestionsClear} = props;
	const {course:courseName} =useParams();

	return <div className="testNotionWrapper">
		<h3 className="testNotion_title">
			Проверь свои знания и пройди тест!
		</h3>
		<span className="testNotion_description">
			Этот тест поможет тебе закрепить усвоенное в уроке и
			получить дополнительную награду за домашнее задание!
		</span>
		<Link
			to={{
				pathname: `/${courseName}/tests/${testId}`,
				state: {lessonId: lessonId, course: courseName},
			}}
		>
			<button
				className="sendFeedback-btn"
				onClick={handleQuestionsClear}
			>
				пройти тест
			</button>
		</Link>
	</div>;
}
export default NotionPageTest;
