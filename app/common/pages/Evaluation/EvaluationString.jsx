import React, { useEffect } from 'react';
import { v4 } from 'uuid';

export default function EvaluationString(props) {
	const { current, crystalsInfo, student, studName, lessons } = props;

	useEffect(() => {
		Object.values(lessons).map((lesson) => (lesson.total = 0));

		Object.entries(crystalsInfo).forEach(([key, value]) => {
			const hardSkillsLessonAmount = value.hardSkills || 0;
			const softSkillsLessonAmount = value.softSkills || 0;
			const crystalsAmount = hardSkillsLessonAmount + softSkillsLessonAmount;

			value.total = crystalsAmount;
			value.lessonNumber = key.split('-').pop();
		});
	}, []);

	const crystalsArr = Object.assign({}, { ...lessons }, { ...crystalsInfo });

	return (
		<div key={student} className="eval-main__student-container">
			<div className="students-eval-info">
				<div className="eval-column">
					<div className="students-blob">
						<div className="students-blob__name">{studName}</div>
						<div className="students-blob__surname">{ }</div>
					</div>
				</div>
			</div>
			<div className="eval-marks-info">
				<div className="eval-marks-table">
					{Object.values(crystalsArr)
						.sort(
							(lesson, nextLesson) =>
								lesson.lessonNumber - nextLesson.lessonNumber
						)
						.map((lesson) => (
							<div
								// key={`w${lesson.lessonNumber}m${lesson.total}`}
								key={v4()}
								className="eval-row__marks"
							>
								<div
									className={
										+current === +lesson.lessonNumber
											? `mark-block mark-${lesson.total} current-lesson-mark`
											: `mark-block mark-${lesson.total}`
									}
								>
									{lesson.total}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
