import React from 'react';
import { ReactComponent as HeartFull } from '../../../assets/hearts/HeartFull.svg';
import { ReactComponent as HeartMistaken } from '../../../assets/hearts/HeartMistaken.svg';
import { ReactComponent as HeartEmpty } from '../../../assets/hearts/HeartEmpty.svg';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Heart({ mistakeDone, isFailed }) {
	const [currentHeart, setCurrentHeart] = useState(<HeartMistaken />);
	useEffect(() => {
		let timer = setTimeout(() => {
			setCurrentHeart(<HeartEmpty />);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);
	return (
		<>
			{isFailed ? (
				<HeartEmpty />
			) : mistakeDone === false ? (
				<HeartFull />
			) : (
				<div>{currentHeart}</div>
			)}{' '}
		</>
	);
}

export { Heart };
