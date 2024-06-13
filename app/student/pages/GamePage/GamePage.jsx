import React, { useState, useEffect } from 'react';
import { Link, Route, useHistory, useParams } from 'react-router-dom';
import GameLevels from '../GameLevels/GameLevels';
import roundArrow from '../../../common/assets/controls/arrows/round_arrow.svg';
import { ReactComponent as Jupiter } from '../../assets/game/Jupiter.svg';
import { ReactComponent as Venus } from '../../assets/game/Venus.svg';
import { ReactComponent as Neptune } from '../../assets/game/Neptune.svg';
import { ReactComponent as IO } from '../../assets/game/IO.svg';
import { handleSlideRight, handleSlideLeft } from "../../../common/controllers/SlidersControllers";
import { getCurrentCourseBlocks, getCurrentLessonOfBlock } from "../../controllers/StudentData";
import { v4 } from "uuid";
import './GamePage.scss';
import {useLoadGroupRepo} from "../../../common/repositories/GroupRepository";
import client from "../../../common/apollo/client";
import {useLoadStudentRepo} from "../../../common/repositories/StudentRepository";

const GamePage = ({
	coursesData,
	step3Ref, step6Ref,
	setCourseIndex, courseIndex
}) => {
	const { course, id: moduleId } = useParams();
	const history = useHistory();

	const userId = Object.values(client.cache.data.data).find(item => item.__typename === "User").id;
	const { data: studentData, loading, error } = useLoadStudentRepo(userId);
	const groups = studentData.studentData.groups;
	const currentGroup = groups.find(group => group.course.name === course);
	const {data, groupLoading, loadGroupError} = useLoadGroupRepo(currentGroup.id);

	const [path, setPath] = useState('');
	const [modules, setModules] = useState([]);

	const blockIcons = [<Jupiter />, <Venus />, <Neptune />, <IO />,];

	useEffect(() => {
		const currentCourse = coursesData.find((item) => item.name === course);
		setModules(getCurrentCourseBlocks(currentCourse, blockIcons, data?.group) || []);
	}, [groupLoading]);

	const lastCourseName = Boolean(courseIndex === coursesData.length - 1);
	const firstCourseName = Boolean(courseIndex === 0);

	const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
	const pathName = isDesktop ? `/${coursesData[courseIndex].name}/game/lessons/module` : `/${coursesData[courseIndex].name}/lessons/module`;

	window.addEventListener("resize", function () {
		if (window.matchMedia("(min-width: 1024px)").matches) {
			setPath(`/${course}/game/lessons/module`)
		} else {
			setPath(`/${course}/lessons/module`)
		}
	});

	const showNextCourse = (newIndex) => {
		setCourseIndex(newIndex);
		if (isDesktop) {
			setPath(`/${coursesData[newIndex].name}/game/lessons/module`);
		} else {
			setPath(`/${coursesData[newIndex].name}/lessons/module`);
		}
		history.push(`/${coursesData[newIndex].name}/game`);
		setModules(getCurrentCourseBlocks(coursesData[newIndex], blockIcons) || []);
	}

	if (groupLoading) {
		return null;
	}

	return (
		<>
			<header>
				<div className={isDesktop ? "header-desktop" : "gamePage-course-header"}>
					<button
						className={firstCourseName ? 'hidden-arrow' : 'gamePage-course-container__button'}
						onClick={() => showNextCourse(courseIndex - 1)}
					>
						<img src={roundArrow} className="gamePage-course-container__arrow gamePage-course-container__arrow_left" />
					</button>
					<h2 className="gamePage-courseName">{course}</h2>
					<button
						className={lastCourseName ? 'hidden-arrow' : 'gamePage-course-container__button'}
						onClick={() => showNextCourse(courseIndex + 1)}
					>
						<img src={roundArrow} className="gamePage-course-container__arrow" />
					</button>
				</div>
			</header>
			<div className="gamePage-container">
				<div className="gamePage-module-wrapper">
					<div className="gamePage-module-container" id="upper-slider">
						{modules.map((module, index) => {
							const step3 = index === 0 ? step3Ref : null;
							const step6 = index === 1 ? step6Ref : null;
							return (
								<div className="gamePage-module" key={v4()}>
									<div
										ref={step3}
										className={`gamePage-module__block ${module.unblocked ? '' : 'blocked'}`}
									>
										<p className="gamePage-module__block-title">
											{module.name}
										</p>
										{module.icon}
										{module.unblocked && (
											<Link
												to={`${path ? path : pathName}/${module.name}`}
											>
												<button
													type="button"
													className="gamePage-module__block-button"
													name={module.name}
												>
													Play
												</button>
											</Link>
										)}
										<p
											className="gamePage-module__block-num"
											ref={step6}
										>
											{getCurrentLessonOfBlock(module, data?.group)}/
											{module.lessonsAmount
												? module.lessonsAmount
												: 4}
										</p>
									</div>
								</div>
							);
						})}
					</div>
					<button className='gamePage-module-wrapper__button'
						onClick={() => handleSlideRight('upper-slider')}
					>
						<img src={roundArrow} className="gamePage-course-container__arrow" />
					</button>
				</div>
				<div className='gamePage-course-container'>
					<button className='gamePage-course-container__button'
						onClick={() => handleSlideLeft('slider')}
					>
						<img src={roundArrow} className="gamePage-course-container__arrow gamePage-course-container__arrow_left" />
					</button>
					<Route path={`/:course/game/lessons/module/:id`}>
						<GameLevels />
					</Route>
					<button className='gamePage-course-container__button'
						onClick={() => handleSlideRight('slider')}
					>
						<img src={roundArrow} className="gamePage-course-container__arrow" />
					</button>
				</div>
			</div >
		</>

	);
};
export default GamePage;
