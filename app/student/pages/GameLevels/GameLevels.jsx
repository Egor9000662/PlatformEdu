import React, { useEffect, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import './GameLevels.scss';
import { ReactComponent as Jupiter } from '../../assets/game/Jupiter.svg';
import { ReactComponent as Venus } from '../../assets/game/Venus.svg';
import { ReactComponent as Neptune } from '../../assets/game/Neptune.svg';
import { ReactComponent as IO } from '../../assets/game/IO.svg';
import { inject, observer } from 'mobx-react';
import GameLevelModul from '../../components/GameLevelModul/GameLevelModul';
import { useParams } from 'react-router-dom';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import dashedLine from '../../assets/game/dashedLine.svg';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import GameLevelsData from "../../models/GameLevelsData";
import { notionPagePath } from "../App/App";
import { useLoadBlockLessons } from "../../../common/repositories/BlockRepository";
import {useLoadGroupRepo} from "../../../common/repositories/GroupRepository";
import client from "../../../common/apollo/client";
import {useLoadStudentRepo} from "../../../common/repositories/StudentRepository";

const GameLevels = () => {
	const location = useLocation();
	const { course, id: blockName } = useParams();
	// const [lessons, setLessons] = useState([]);

	const userId = Object.values(client.cache.data.data).find(item => item.__typename === "User").id;
	const { data: studentData, loading, error } = useLoadStudentRepo(userId);
	const groups = studentData.studentData.groups;
	const currentGroup = groups.find(group => group.course.name === course);
	const {data, groupLoading, loadGroupError} = useLoadGroupRepo(currentGroup.id);

	// useEffect(() => {
	// 	setLessons(blockLessons);
	// }, [blockName]);

	if ( loading || groupLoading) {
		return null;
	}
	const blockLessons = data.group.schedules.filter(item => {
		if(item.lesson.block.name === blockName) {
			return item;
		}
	});


	// useEffect(() => {
	// 	setLessons(gameLevels.getLessons(course));
	// }, [course]);

	// if (!lessonsStore.allCourses || !gameLevels.currentLessonId) {
	// 	return null;
	// }

	// gameLevels.openLesson();

	const handlePathName = () => {
		localStorage.setItem('pathName', location.pathname);
	};


	return (
		<div className="gameLevels-Container" id='slider'>
			<div className="gameLevels-header">
				<BackArrow pathName={`/${course}/game`} />
				<Link to="/group-meeting">
					<button
						onClick={() => handlePathName()}
						className="gameLevels-btnMeeting"
					>
						Созвоны
					</button>
				</Link>
			</div>
			<div className="gameLevels-ThemeModul">
				<p className="gameLevels-ThemeText">{blockName}</p>
				{
					{
						Трудоустройство: <IO />,
						React: <Neptune />,
						JS: <Venus />,
						'Основы разработки мобильных приложений': <Venus />,
						'Продвинутая разработка мобильных приложений': (
							<Jupiter />
						),
						'HTML CSS': <Jupiter />,
					}[blockName]
				}
			</div>
			<div className="gameLevels-Body">
				{blockLessons
					// .slice()
					// .filter((item) => item.block === blockName)
					.map((lesson, index) => (
						<div className="gameLevels-Lesson" key={lesson.id}>
							<Link
								to={generatePath(notionPagePath, {
									course, id: lesson.lesson.id
								})}
								// className={
									// gameLevels.unblockLessons(lesson.id)
									// 	? ''
									// 	:
									// 'gameLevels-disabled-link'
								// }
								onClick={() => handlePathName()}
							>
								<GameLevelModul
									lesson={lesson}
								/>
							</Link>
							<img className="gameLevels-dash" src={dashedLine} />
						</div>
					))}
			</div>
		</div>
	);
};
export default GameLevels;
