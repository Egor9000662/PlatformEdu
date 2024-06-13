function isSelected(day, value) {
	return value.isSame(day, "day");
}

function isToday(day) {
	return day.isSame(new Date(), "day");
}

export default function dayStyles(day, value) {
	if (isSelected(day, value)) return "selected";
	if (isToday(day)) return "today";
	return "";
}
