const isValidAnswer = (options, userAnswer) => {
	const relevant = Object.keys(options).filter(
		(key) => options[key].isValid === true
	);
	const res = Object.keys(userAnswer);
	function arrayEquals(a, b) {
		if (a.length === b.length) {
			return a.every((val, index) => val === b[index]);
		}
		if (b.length !== a.length) {
			return false;
		}
	}

	return arrayEquals(relevant, res);
};

export default isValidAnswer;
