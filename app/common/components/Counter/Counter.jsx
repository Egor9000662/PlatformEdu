import React from "react";
import "./Counter.scss";

export default function Counter(props) {
	const { num, test } = props;
	const number = test ? num.split("/")[0] : num;
	let isColored = (part) =>
		number >= part ? "colored-circle" : "uncolored-circle";
	return (
		<div className="counter">
			<div className="counter-circle">
				<div className={`part1 ${isColored(1)}`} />
				<div className={`part2 ${isColored(2)}`} />
				<div className={`part3 ${isColored(3)}`} />
				<div className={`part4 ${isColored(4)}`} />
				<div className={`part5 ${isColored(5)}`} />
			</div>
			<span className="counter-num">{num}</span>
		</div>
	);
}
