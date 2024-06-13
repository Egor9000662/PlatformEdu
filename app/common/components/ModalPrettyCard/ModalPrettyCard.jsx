import React from "react";
import "./ModalPrettyCard.scss";

export default function ModalPrettyCard() {
	return (
		<div className="m-wrapper">
			<div className="m-close">&#10006;</div>
			<div className="m-card">
				<div className="m-card__header-wrap">
					<div className="m-card__header" />
				</div>
			</div>
		</div>
	);
}
