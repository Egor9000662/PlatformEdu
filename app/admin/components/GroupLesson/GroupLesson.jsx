import React from 'react';
import { number } from 'prop-types';

export default function GroupLesson(props) {
	const { lessonNumber } = props;
	return (
		<div>
			текущая неделя
			{' '}
			{lessonNumber}
		</div>
	);
}

GroupLesson.propTypes = {
	lessonNumber: number,
};

GroupLesson.defaultProps = {
	lessonNumber: 0,
};
