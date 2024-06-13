/* eslint-disable */
import React, { useState } from "react";
import { useEffect } from "react";
import Star from "./Star";

export default function StarRating({
	numTotalStars,
	initialRating,
	onChangeQuality,
	onChangeDifficulty,
	starsFor,
}) {
	const [numSelectedStars, setNumSelectedStars] = useState(initialRating);
	const [numHoveringStars, setNumHoveringStars] = useState(null);

	const [isUserHovering, setIsUserHovering] = useState(false);

	function getColor(isUserHovering, i, numSelectedStars, numHoveringStars) {
		const threshold = isUserHovering ? numHoveringStars : numSelectedStars;
		return i < threshold ? "yellow" : "grey";
	}

	useEffect(()=> {
		if (numSelectedStars && starsFor === "quality") {
			onChangeQuality(numSelectedStars);
		}
	}, [numSelectedStars]);
	
	useEffect(()=> {
		if (numSelectedStars && starsFor === "difficulty") {
			onChangeDifficulty(numSelectedStars);
		}
	}, [numSelectedStars]);

	return (
		<div className="star-rating">
			<div
				onMouseEnter={() => setIsUserHovering(true)}
				onMouseLeave={() => setIsUserHovering(false)}
			>
				{Array.from({ length: numTotalStars }).map((e, i) => (
					<Star
						key={`${i} - ${starsFor}`}
						color={getColor(
							isUserHovering,
							i,
							numSelectedStars,
							numHoveringStars
						)}
						handleSelect={() => setNumSelectedStars(i + 1)}
						handleHover={() => setNumHoveringStars(i + 1)}
					/>
				))}
			</div>
		</div>
	);
}

export { StarRating };
