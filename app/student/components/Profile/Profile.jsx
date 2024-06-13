import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import './Profile.scss';
import FeedbackSchool from '../FeedbackWindows/FeedbackSchool/FeedbackSchool';
import AchievementsList from '../Achievement/AchievementsList/AchievementsList';
import ProfilePage from "../../models/ProfilePage";

function Profile({
	onboardingActive,
	student,
	studentProfile,
}) {
	const [feedbackSchoolModalVisible, setFeedbackSchoolModalVisible] = useState(false);
	const [feedbackSentFlag, setFeedbackSentFlag] = useState(false);

	const handleFeedbackHometaskCancel = () => {
		setFeedbackSchoolModalVisible(false);
		setFeedbackSentFlag(true);
	};
	// useEffect(() => {
	// 	setFeedbackSchoolModalVisible(studentProfile.showFeedbackModal(feedbackSentFlag))
	// }, [studentProfile.lastFeedbackDate]);

	return (
		<div className="profile__wrapper">
			<Link to="/skills">
				<button className="profile__btn_info">Навыки</button>
			</Link>
			<Link to="/resume">
				<button className="profile__btn_info">Резюме</button>
			</Link>
			<Link to="/group-meeting">
				<button className="profile__btn_info">Созвоны</button>
			</Link>
			{/* {student.achievement && */}
			<AchievementsList
			// student={student}
			/>
			{/* } */}
			{!onboardingActive && (
				<Modal
					open={feedbackSchoolModalVisible}
					onCancel={handleFeedbackHometaskCancel}
					footer={null}
					className="estimation-meetings-modal"
					width="400px"
				>
					<FeedbackSchool
						showEstimationModalForm={setFeedbackSchoolModalVisible}
						setFeedbackSentFlag={setFeedbackSentFlag}
					/>
				</Modal>
			)}
		</div>
	);
}

export default
	// inject(({ auth, feedbackStore, groupsStore, oneCourseStore, usersStore, progressStore }) => {
	// 	const { profile } = auth;

	// 	useEffect(() => {
	// 		groupsStore.loadData();
	// 	}, [profile]);
	// 	const group = groupsStore.getGroup(profile.group);

	// 	useEffect(() => {
	// 		oneCourseStore.id = profile.course;
	// 		oneCourseStore.loadData(profile.course);
	// 	}, [oneCourseStore.isLoaded, profile])

	// 	const student = usersStore.getUser(profile.uid);
	// 	useEffect(() => {
	// 		student.loadData(profile.uid);
	// 	}, [profile, student.isLoaded]);

	// 	const studentProfile = new ProfilePage(group, student, progressStore)
	// 	return {
	// 		student,
	// 		studentProfile,
	// 	};
	// })(observer(
	Profile
	// ));
