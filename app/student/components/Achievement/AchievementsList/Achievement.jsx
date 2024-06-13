import React from 'react';
import ProgressBar from '../../../../common/components/ProgressBar/ProgressBar';
import Default from '../../../assets/achievementIcons/default.png';
import Extra from '../../../assets/achievementIcons/extra.png';
import Final from '../../../assets/achievementIcons/final.png';
import FirstBlock from '../../../assets/achievementIcons/first.png';
import SecondBlock from '../../../assets/achievementIcons/second.png';
import ThirdBlock from '../../../assets/achievementIcons/third.png';

function SvgBackgrounds() {
	return (
		<>
			<svg className="svg">
				<clipPath
					id="achievement-border"
					clipPathUnits="objectBoundingBox"
				>
					<path d="M0.026,0.893 V0.583 C0.026,0.549,0.041,0.525,0.054,0.537 L0.073,0.554 C0.103,0.582,0.137,0.584,0.168,0.56 C0.216,0.523,0.249,0.414,0.249,0.291 V0.192 C0.249,0.106,0.277,0.036,0.313,0.036 H0.968 C1,0.036,1,0.099,1,0.178 V0.893 C1,0.972,1,1,0.968,1 H0.085 C0.052,1,0.026,0.972,0.026,0.893"></path>
				</clipPath>
			</svg>
		</>
	);
}

function Achievement({ achievement }) {
	const { title, description, currentValue, maximumValue, id } = achievement;

	let currentIcon = Default;
	switch (id) {
		case 'shockMode':
			currentIcon = Extra;
			break;
		case 'HTML':
			currentIcon = FirstBlock;
			break;
		case 'JS':
			currentIcon = SecondBlock;
			break;
		case 'React':
			currentIcon = ThirdBlock;
			break;
		default:
			break;
	}
	return (
		<div className="achievement-container">
			<img className="achievement-image" src={currentIcon} alt={currentIcon}/>
			<div className="achievement-content">
				{' '}
				<div className="achievement-body">
					<p className="achievement-name">{title}</p>
					<p className="achievement-description">{description}</p>
					<div className="achievement-progress">
						<ProgressBar item={currentValue} amount={maximumValue} />
						<span className="achievement-stats">
							{currentValue}/{maximumValue}
						</span>
					</div>
				</div>
			</div>
			<SvgBackgrounds />
		</div>
	);
}

export default Achievement;
