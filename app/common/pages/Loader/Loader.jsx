import React from "react";
import "./Loader.scss";
import loadermoon from "../../../assets/images/loadermoon.png";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Background from "../../../assets/images/background-desktop.jpg";

export default function Loader() {
	return (
		<div
			className="background"
			style={{
				background: `url(${Background})`,
				backgroundSize: "cover",
			}}
		>
			<div className="background__load load">
				<img className="load__img-moon" src={loadermoon} alt="moon" />
			<ProgressBar item={7} amount={10}/>
			</div>
		</div>
	);
}
