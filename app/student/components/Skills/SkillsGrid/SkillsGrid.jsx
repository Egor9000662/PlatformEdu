import React, { useEffect, useState } from 'react';
import SkillItem from './SkillItem';
import { inject, observer } from 'mobx-react';
import data from './hardSkills.json';
import BackArrow from '../../../../common/components/BackArrow/BackArrow';
import ProgressBar from '../../../../common/components/ProgressBar/ProgressBar';

import './SkillsGrid.scss';

function SkillsGrid() {
	const [skillsAmount, setSkillsAmount] = useState(0);
	const [openSkills, setOpenSkills] = useState(0);

	useEffect(() => {
		setSkillsAmount(data.length);
		let openAmount = 0;

		data.forEach((item) => (item.status === 'done' ? openAmount++ : ''));
		setOpenSkills(openAmount);
	});

	return (
		<div className="HScontainer">
			<div className="skills-header">
				<div className="skills-header-btn">
					<BackArrow pathName={'/profile'} />
				</div>
				<ProgressBar item={openSkills} amount={skillsAmount} />
				<div className="test-header-counter">
					{openSkills}/{skillsAmount}
				</div>
			</div>

			<div className="hardSkillsWrapper">
				{data.map((item) => (
					<SkillItem key={item.id} {...item} />
				))}
			</div>
		</div>
	);
}
export default SkillsGrid;
