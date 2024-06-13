/* eslint-disable */
import React from "react";
import { ReactComponent as StarDefault } from "../../../common/assets/stars/StarDefault.svg";
import { ReactComponent as StarYellow } from "../../../common/assets/stars/StarYellow.svg";

export default function Star({
	color = "grey",
	handleSelect = () => {},
	handleHover = () => {},
}) {
	return (
		<>
			{color === "grey" ? (
				<StarDefault onMouseOver={handleHover} onClick={handleSelect} />
			) : (
				<StarYellow onMouseOver={handleHover} onClick={handleSelect} />
			)}
		</>
	);
}

export { Star };
