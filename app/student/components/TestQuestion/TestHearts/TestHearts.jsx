import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Heart from './Heart';
import './TestHearts.scss';

export default function TestHearts({ mistakesNum, isFailed }) {
	const [mistakes, setMistakes] = useState(0);
	let totalHearts = 3;
	useEffect(() => {
		setMistakes(mistakesNum);
	}, [mistakesNum !== mistakes]);

	function getMistaken(i, mistakes) {
		return i < mistakes ? true : false;
	}

	return (
		<div className="hearts-container">
			{Array.from({ length: totalHearts }).map((e, i) => (
				<Heart
					key={i}
					mistakeDone={getMistaken(i, mistakes)}
					isFailed={isFailed}
				/>
			))}
		</div>
	);
}

export { TestHearts };
