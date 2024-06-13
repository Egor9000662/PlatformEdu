import moment from "moment";

export default function buildCalendar(value) {
	if (!value) {
		return [];
	}
	const startDay = value.clone().startOf("month");
	const endDay = value.clone().endOf("month");
	const day = startDay.clone().subtract(1, "day");
	const calendar = [];
	while (day.isBefore(endDay, "day")) {
		calendar.push(
			Array(moment().date(moment().daysInMonth()))
				.fill(0)
				.map(() => day.add(1, "day").clone())
		);
	}

	return calendar;
}
