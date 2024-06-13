/*eslint-disable*/
import React from 'react';
import './PassCircle.scss';
import galka from './galka.svg';

const PassCircle = ({ lesson }) => {
	return (
		<div>
			<div className="pass-day">{lesson}</div>
			<div className="pass-circle">
				<img src={galka} alt="galka" />
			</div>
		</div>
	);
};
export default PassCircle;
