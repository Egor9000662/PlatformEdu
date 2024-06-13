import React from 'react';
import './FeedbackTable.scss';
import FeedbackMentors from './FeedbackType/FeedbackMentors.jsx';
import FeedbackStudent from './FeedbackType/FeedbackStudent';
import FeedbackLesson from './FeedbackType/FeedbackLesson';
import FeedbackLow from './FeedbackType/FeedbackLow';
import FeedbackSchool from './FeedbackType/FeedbackSchool';

function FeedbackTable({
	feedbackType,
	filterBy,
	mentorId,
	adminFeedbackModel,
}) {
	const courseInfo = adminFeedbackModel.getCourseInfo(filterBy);

	return (
		<div className="feedbackTable-container">
			{adminFeedbackModel.feedbackInfo.length > 0 && filterBy !== '' && (
				<>
					<>
						{feedbackType === 'mentor' && (
							<FeedbackMentors
								mentorId={mentorId}
								adminFeedbackModel={adminFeedbackModel}
							/>
						)}
						{feedbackType === 'student' && (
							<FeedbackStudent
								studentId={filterBy}
								adminFeedbackModel={adminFeedbackModel}
							/>
						)}
						{feedbackType === 'lessons' && (
							<FeedbackLesson
								courseInfo={courseInfo}
								adminFeedbackModel={adminFeedbackModel}
							/>
						)}
						{feedbackType === 'low' && (
							<FeedbackLow
								feedbackInfo={adminFeedbackModel.feedbackInfo}
								filterBy={filterBy}
								adminFeedbackModel={adminFeedbackModel}
							/>
						)}
					</>
				</>
			)}
			<>
				{adminFeedbackModel.feedbackInfo.length > 0 && feedbackType === 'school' && (
					<FeedbackSchool
						adminFeedbackModel={adminFeedbackModel}
					/>
				)}
			</>
		</div>
	);
}

export default FeedbackTable;
