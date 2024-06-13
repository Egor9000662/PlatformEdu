import React, { useState, useEffect, useRef } from 'react';
import './ProgressBar.scss';

export default function ProgressBar(props) {
	const triangle = useRef(null);
	const dot = useRef(null);
	const [length, setLength] = useState();

	function Bar() {
		const percent = props.percent ? props.percent : 100;
		const progressNum = (percent * props.item) / props.amount;
		setLength(progressNum);
	}
	onresize = () => Bar();

	useEffect(() => {
		Bar();
		return () => {
			null;
		}
	}, []);

	useEffect(() => {
		triangle.current.style.width = length + '%';
		dot.current.style.left = length + '%';
	}, [length]);

	return (
		<div className="pb__wrapper">
			<div className="pb__line"></div>
			<div className="pb__triangle" ref={triangle}></div>
			<div ref={dot} className="pb__dot"></div>
		</div>
	);
}
