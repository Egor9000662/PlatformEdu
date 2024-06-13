import React, { useEffect } from "react";
import {generatePath, Link} from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Divider } from "antd";
import "./CoursePage.scss";
import LessonCard from "../../../common/components/LessonCard/LessonCard";
import {notionPagePath} from "../App/App";
// import GameLevels from '../GameLevels/GameLevels';

function CoursePage({ lessons, currentLessonId, course }) {
	if (!lessons) {
		return null;
	}

	return (
		<div className="courseListWrapper">
			<Divider orientation="center" style={{ border: "#fff" }}>
				<span style={{ color: "#fff", fontWeight: "600" }}>
					Моя учёба
				</span>
			</Divider>
			{lessons
				.sort(function (a, b) {
					return a.lessonNumber - b.lessonNumber;
				})
				.map((lessonInfo) => (
					<Link to={generatePath(notionPagePath, {course, id: lessonInfo.id})} key={lessonInfo.id}>
						<LessonCard
							{...lessonInfo}
							selected={currentLessonId === lessonInfo.id}
						/>
					</Link>
				))}
			{/* <GameLevels /> */}
		</div>
	);
}

export default inject(({ groupsStore, auth, lessonsStore }) => {
	const { profile } = auth;
	const { getGroup } = groupsStore;
	const { lessons, loadData } = lessonsStore;

	const course = profile?.course;
	const id = profile?.group;

	const group = getGroup(id);
	const currentLessonId = group?.lesson?.id;
	const currentLessons = group?.openLessons
		?.map((openLesson) =>
			lessons.find((lessonItem) => lessonItem.id === openLesson.id)
		)
		.filter((item) => item)
		.reverse();

	useEffect(() => {
		loadData(course);
	}, [course]);

	useEffect(() => {
		group.loadData();
	}, [id]);

	return {
		currentLessonId,
		lessons: currentLessons,
		course,
	};
})(observer(CoursePage));
