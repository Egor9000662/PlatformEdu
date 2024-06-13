import React, { useState } from 'react';
import './UpArrow.scss';
import upArrowButton from '../../../common/assets/controls/arrows/up-arrow.svg';

const UpArrow = ({ handleScroll }) => {
	const [isShown, setIsShown] = useState(false);
	const target = document.querySelectorAll('.notion-text')[10];
	const startPage = document.querySelector('.np-scrollSpan');
	function callback(entries) {
		entries.forEach((entry) => {
			const value = entry.target === startPage ? false : true;
			if (entry.isIntersecting) {
				setIsShown(value);
			}
		});
	}
	let observer = new IntersectionObserver(callback);
	if (target) {
		observer.observe(target);
	}
	observer.observe(startPage);

	return (
		<div>
			{isShown && (
				<button
					type="button"
					onClick={handleScroll}
					className="upArrow"
				>
					<img src={upArrowButton} alt="up" />
				</button>
			)}
		</div>
	);
};

export default UpArrow;
