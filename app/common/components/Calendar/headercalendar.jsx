import React from "react";
import ArrowRight from "../../../common/assets/controls/arrows/arrow_right.svg";
import ArrowLeft from "../../../common/assets/controls/arrows/arrow_left.svg";

export default function CalendarHeader({ value, setValue }) {
	function currMonthName() {
		return value.locale("ru").format("MMMM");
	}
	function prevMonth() {
		return value.clone().subtract(1, "month");
	}
	function nextMonth() {
		return value.clone().add(1, "month");
	}
	return (
		<div className="monthCarousel">
			<div className="previous" onClick={() => setValue(prevMonth())}>
				<img
					className="monthCarousel_arrow_left"
					src={ArrowLeft}
					alt="Arrow"
				/>
			</div>
			<div className="current">{currMonthName()}</div>
			<div className="next" onClick={() => setValue(nextMonth())}>
				<img
					className="monthCarousel_arrow_right"
					src={ArrowRight}
					alt="Arrow"
				/>
			</div>
		</div>
	);
}
