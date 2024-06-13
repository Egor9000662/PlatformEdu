import React, { useEffect, useState } from 'react';
import { ReactComponent as NotPassed } from '../../assets/game/NotPassed.svg';
import { ReactComponent as InProgress } from '../../assets/game/InProgress.svg';
import InProgressAnimated from '../../assets/game/InProgressAnimated.svg';
import { ReactComponent as Passed } from '../../assets/game/Passed.svg';
import PassedAnimated from '../../assets/game/PassedAnimated.svg';

function AnimatedInProgress() {
	return (
		<object
			className="gL-animatedIcon"
			type="image/svg+xml"
			data={InProgressAnimated}
		>
			svgInProgressAnimated
		</object>
	);
}

function AnimatedPassed() {
	return (
		<object
			className="gL-animatedIcon"
			type="image/svg+xml"
			data={PassedAnimated}
		>
			svgPassedAnimated
		</object>
	);
}

const ProgressIcon = ({ isAnimated, progressType, }) => {
	const [currentProgressIcon, setCurrentProgressIcon] = useState('');

	useEffect(() => {
		renderProgressIcon(isAnimated);
	}, [isAnimated]);

	function handleAnimated(type) {
		if (type === 'passed') {
			setCurrentProgressIcon(<AnimatedPassed />);
		}

		if (type === 'inProgress') {
			setCurrentProgressIcon(<AnimatedInProgress />);
		}
	}

	const renderProgressIcon = (isAnimated) => {
		if (progressType === 'passed') {
			{
				isAnimated
					? handleAnimated(progressType)
					: setCurrentProgressIcon(<Passed />);
			}
		} else if (progressType === 'inProgress') {
			{
				isAnimated
					? handleAnimated(progressType)
					: setCurrentProgressIcon(<InProgress />);
			}
		} else {
			setCurrentProgressIcon(<NotPassed />);
		}
	};

	useEffect(() => {
		if (progressType === 'inProgress') {
			let timer = setTimeout(() => {
				setCurrentProgressIcon(<InProgress />);
			}, 4000);

			return () => {
				clearTimeout(timer);
				handleAnimated();
			};
		}
	}, []);

	useEffect(() => {
		if (progressType === 'passed') {
			let timer = setTimeout(() => {
				setCurrentProgressIcon(<Passed />);
			}, 4000);

			return () => {
				clearTimeout(timer);
				handleAnimated();
			};
		}
	}, []);

	return (
		<div className={`gameLevels-ProgressIcon`}>{currentProgressIcon}</div>
	);
};
export default ProgressIcon;
