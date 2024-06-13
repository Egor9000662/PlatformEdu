/*eslint-disable*/

import React from 'react';
import PassCircle from './PassCircle/PassCircle';
import cat from '../../../assets/progressModal/progressCat.svg';
import defaultAvatar from '../../../../common/assets/defaultAvatars/frontend-avatar.png';
import './ProgressModal.scss';
import { v4 as uuidv4 } from 'uuid';

const ProgressModal = ({
	numberShockModeWeeks,
	weekNumber,
	avatar = defaultAvatar,
}) => {
	let shockModeWeeks = [];
	if (numberShockModeWeeks?.shockMode?.currentValue) {
		const numberWeeks = numberShockModeWeeks.shockMode.currentValue;
		for (let i = 1; i <= numberWeeks; i++) {
			shockModeWeeks.push(i);
		}
	} else {
		for (let i = 1; i <= weekNumber; i++) {
			shockModeWeeks.push(i);
		}
	}

	return (
		<div className="progress-content">
			<div className="progress-cat" id="progress_cat">
				<img className="cat-img" src={cat} alt="cat" />
				<div className="personal-img">
					<img src={avatar} alt="avatar" />
				</div>
			</div>
			<div className="progress-count">
				{shockModeWeeks.map((week) => {
					return <PassCircle week={week} key={uuidv4()} />;
				})}
			</div>
			<div className="progress-line"></div>
			<div className="progress-text">
				<p>Молодец! Старайся соблюдать дедлайн, </p>
				<p>чтобы сохранить ударный режим.</p>
			</div>
		</div>
	);
};

export default ProgressModal;
