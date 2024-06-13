import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './HomeButton.scss';
import homeButton from '../../../common/assets/controls/home-btn.svg';
function HomeButon() {
	const history = useHistory();
	const handleHome = () => {
		history.push('/');
	};
	return (
		<div>
			<button type="button" onClick={handleHome} className="homeBtn">
				<img src={homeButton} alt="back" />
			</button>
		</div>
	);
}

export default HomeButon;
