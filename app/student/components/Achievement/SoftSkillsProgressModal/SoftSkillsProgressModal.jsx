import React from "react";
import fighter from '../../../assets/achievementIcons/fighter.png';
import './SoftSkillsProgressModal.scss';

export default function SoftSkillsProgressModal() {
	return (
		<div className="progress-content" >
			<div
				className="progress-cat"
				id="soft-skills_cat"
			>
				<img className="cat-img" src={fighter} alt="fighter"/>
			</div>
			<div className="soft-skills_text">Так держать! <br/>Мягкие навыки очень важны.</div>
		</div>
	)
}
