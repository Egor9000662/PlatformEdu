import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './BackArrow.scss';
import backButton from '../../../common/assets/controls/back-btn.svg';

function BackArrow({ pathName }) {
	const history = useHistory();

	const handleBack = () => {
		if (pathName) {
			history.push(pathName);
			return;
		}
		history.goBack()
	};
	return (
		<div>
			<button type="button" onClick={handleBack} className="round-button">
				<img src={backButton} alt="back" />
			</button>
		</div>
	);
}

export default BackArrow;
