import React from 'react';
import {generatePath, Link, useParams} from "react-router-dom";
import HardSkills from "../../../../common/assets/сrystals/crystallHardSkills.svg";
import DiamondGrey from '../../../assets/game/DiamondGrey.svg';
import fighter from '../../../assets/achievementIcons/fighter.png'
import './TestAchievement.scss'
import shine from "../../../assets/progressModal/shine.svg";
import {notionPagePath} from "../../../pages/App/App";

function TestAchievement({ weekId, crystalNum, deadlineOverdue, text }) {
	const {course:courseName} =useParams();

	return (
		<div className="test-result-wrapper">
			<div className="test-result-window">
				<div className="wrapper">
					<div className="test-result__top-line">
						<div className="test-result__crystal">
							<div className="crystals-amount">
								<img src={deadlineOverdue ? DiamondGrey : HardSkills} alt="hard-skills" />
								{crystalNum}
							</div>
						</div>
						<div className="test-result__text">Ура! Ты боец!</div>
					</div>
					<div className="test-result__img"
						style={{ backgroundImage: `url(${shine})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
					>
						<img src={fighter} alt={fighter} />
					</div>
					<div className="test-result__phrase">{text}</div>
					<div className="test-result__btns">
						<Link
							to={{
								pathname: generatePath(notionPagePath, {course:courseName, id:weekId})
							}}
						>
							<button className="sendBtn1" type="submit">К уроку</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);

}
export default TestAchievement
