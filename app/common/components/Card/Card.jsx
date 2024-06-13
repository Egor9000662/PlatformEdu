import React from "react";
import { string } from "prop-types";
import "./Card.scss";

export default function Card(props) {
	const { title, description, children, timeLeft, taskDone, end } = props;
	let overdue = false;

	if (taskDone === undefined && timeLeft < -86400000) {
		overdue = true;
	}
	let daysOverdue = 0;
	if (overdue) {
		const now = new Date();
		const diff = Math.floor(now - end);
		daysOverdue = Math.floor(diff / 1000 / 3600 / 24);
	}

	return (
		<div className={overdue ? `card overdue` : "card"}>
			<div className="c-card__header-wrap">
				<div className="c-card__header">{title}</div>
			</div>

			{description ? (
				<div className="card__description-week">{description}</div>
			) : null}

			{children ? (
				<div
					className={overdue ? "overdue-children" : "card__children"}
				>
					{children}
				</div>
			) : null}
			{overdue ? (
				<div className="card__overdue-block">
					{" "}
					Задание не выполнено вовремя!{" "}
					<span>Задержка в днях: {daysOverdue}</span>
				</div>
			) : null}
		</div>
	);
}

Card.propTypes = {
	title: string,
	description: string,
};

Card.defaultProps = {
	title: "тема недели",
	description: "",
};
