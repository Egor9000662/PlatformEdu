const formatDateTimeNum = (num)=> num<10? `0${num}`:num;

const formatDate = (date) => {
	const d = date.getDate();
	const day = formatDateTimeNum(d);
	const m = date.getMonth() + 1;
	const month =formatDateTimeNum(m);
	const year = date.getFullYear();
	const newDate = `${day}.${month}.${year}`;
	return newDate;
};
const formatDateMonthYear = (date) => {
	const d = date.getDate();
	const day = formatDateTimeNum(d);
	const m = date.getMonth() + 1;
	const month =formatDateTimeNum(m);
	const year = date.getFullYear();
	const newDate = {
		day,
		month,
		year,
	}
	return newDate;
};

const formatTime = (num) => {
	const dateSent = new Date(num);
	const dateNow = new Date();
	const dayNow = dateNow.getDate();
	const monthNow = formatDateTimeNum(dateNow.getMonth()+1);
	const yearNow = dateNow.getFullYear();
	const day = formatDateTimeNum(dateSent.getDate());
	const month = formatDateTimeNum(dateSent.getMonth()+1);
	const year = dateSent.getFullYear();
	const hours = formatDateTimeNum(dateSent.getHours());
	const minutes = formatDateTimeNum(dateSent.getMinutes());
	const today = `${hours}:${minutes}`;
	const yesterday = `вчера ${hours}:${minutes}`;
	const daysAgo = `${day}.${month} ${hours}:${minutes}`;
	const overYear = `${day}.${month}.${year} ${hours}:${minutes}`;
if (dayNow === +day && yearNow === year){
		return today;
	} else if (dayNow !== +day && monthNow === +month && yearNow === year){
		return yesterday;
	} else if (dayNow !== +day && monthNow !== +month && yearNow === year) {
		return daysAgo;
	} else {
		return overYear;
	};
};

export {formatDate, formatDateTimeNum, formatTime, formatDateMonthYear};
