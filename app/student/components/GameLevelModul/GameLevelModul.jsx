import React, { useEffect, useState } from 'react';
import './GameLevelModul.scss';
import { ReactComponent as DiamondBlueDefault } from '../../assets/game/DiamondBlueDefault.svg';
import { ReactComponent as DiamondOrangeDefault } from '../../assets/game/DiamondOrangeDefault.svg';
import { ReactComponent as DiamondBlue } from '../../assets/game/DiamondBlue.svg';
import { ReactComponent as DiamondOrange } from '../../assets/game/DiamondOrange.svg';
import { ReactComponent as DiamondGrey } from '../../assets/game/DiamondGrey.svg';
import { inject, observer } from 'mobx-react';
import ProgressIcon from './ProgressIcon';
import { v4 as uuidv4 } from 'uuid';
import GameLevelModule from "../../models/GameLevelModule";
import GameLevelsController from "../../controllers/GameLevelsController";

const AlternativeDiamond = (task) => {
	if (task.taskType === 'practice' && task.homeworkStatus === 'accepted' && task.deadlineOverdue) {
		return task.extraTask ? (
			<>
				<DiamondGrey />
				<DiamondGrey />
			</>
		) : (
			<>
				<DiamondGrey />
			</>
		)
	} else if (task.taskType === 'test' && task.deadlineOverdue && task.crystal) {
		return (
			<>
				<DiamondGrey />
			</>
		)
	} else {
		return (
			<>
				{task.taskType === 'soft-skills' ?
					<DiamondBlueDefault /> :
					<DiamondOrangeDefault />}
			</>
		);
	}
};

const GameLevelModul = ({
	lesson,
}) => {
	const gameLevelsController = new GameLevelsController();

	const [isAnimated, setIsAnimated] = useState(true);
	const [tasksInfo, setTasksInfo] = useState([]);
	const [hardSkills, setHardSkills] = useState([]);
	const [softSkills, setSoftSkills] = useState([]);

	const getCurrentCrystals = async (uid, weekNumber) => {
		// const crystalsAmount = await progressStore.getWeeklyCrystalsAmount(uid, `week-${weekNumber}`);
		// if (crystalsAmount.hardSkills) {
		// 	setHardSkills([...Array(crystalsAmount.hardSkills)])
		// }
		// if (crystalsAmount.softSkills) {
		// 	setSoftSkills([...Array(crystalsAmount.softSkills)])
		// }
	}

	// useEffect(() => {
	// 	getCurrentCrystals(uid, weekNumber).catch(console.error);
	// 	const getTasksInfo = async () => {
	// 		const result = await gameLevelModule.getTasksData(uid);
	// 		setTasksInfo(result);
	// 	}
	// 	getTasksInfo().catch(console.error);
	// }, [lesson.tasks]);

	return (
		<div className="gameLevels-Modul">
			<div className="gameLevels-Content">
				<p className="gameLevels-Text">{lesson.lesson.name}</p>
				<div className="gameLevels-Progress">
					<p className="gameLevels-Text  gameLevels-Number">
						{lesson.lesson.lessonNumber}
					</p>
					<div className={`gameLevels-ProgressIcon`}>
						<ProgressIcon
							isAnimated={isAnimated}
							progressType={gameLevelsController.getProgressLesson(lesson)}
						/>
					</div>
				</div>
				{/*<div className="gameLevels-Diamonds">*/}
				{/*	{hardSkills && hardSkills.map(() => {*/}
				{/*		return (*/}
				{/*			<span*/}
				{/*				className="diamond"*/}
				{/*				key={uuidv4()}*/}
				{/*			>*/}
				{/*				<DiamondOrange />*/}
				{/*			</span>*/}
				{/*		);*/}
				{/*	})}*/}
				{/*	{softSkills && softSkills.map(() => {*/}
				{/*		return (*/}
				{/*			<span*/}
				{/*				className="diamond"*/}
				{/*				key={uuidv4()}*/}
				{/*			>*/}
				{/*				<DiamondBlue />*/}
				{/*			</span>*/}
				{/*		);*/}
				{/*	})}*/}

				{/*	{!hardSkills.length && !softSkills.length &&*/}
				{/*		tasksInfo.map((task) => {*/}
				{/*			return (*/}
				{/*				<span*/}
				{/*					className="diamond"*/}
				{/*					key={uuidv4()}*/}
				{/*				>*/}
				{/*					<AlternativeDiamond {...task} />*/}
				{/*				</span>*/}
				{/*			);*/}
				{/*		})}*/}
				{/*</div>*/}
			</div>
		</div>
	);
};
export default GameLevelModul;
