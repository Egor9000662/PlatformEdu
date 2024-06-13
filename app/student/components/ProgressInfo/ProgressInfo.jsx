import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import './ProgressInfo.scss';
import { Link } from 'react-router-dom';
import SettingsPic from '../../../common/assets/controls/all_settings_icon.svg';
import SoftSkills from '../../../common/assets/сrystals/crystallSoftSkills.svg';
import HardSkills from '../../../common/assets/сrystals/crystallHardSkills.svg';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import roundArrow from '../../../common/assets/controls/arrows/round_arrow.svg';
import Crown from '../../../common/assets/crown.svg';
import DownloadAvatar from '../DownloadAvatar/DownloadAvatar';
import ProgressBar from '../../../common/components/ProgressBar/ProgressBar';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import HomeButon from '../../../common/components/HomeButton/HomeButton';
import ProfilePage from "../../models/ProfilePage";
import { useReadUser } from "../../../common/apollo/localState/UserLocalState";
import { useGetByNameUserRepo } from "../../../common/repositories/UserRepository";
import SidebarModel from "../../../common/models/SidebarModel";
import getFormattedCourseName from "../../../common/template/formattedCourseName";

function ProgressInfo({
	course,
	step5Ref,
	arrCourseStudent,
	studentData,
}) {
	const [courseIndex, setCourseIndex] = useState(0);
	const [hardSkillsAmount, setHardSkillsAmount] = useState(0);
	const [softSkillsAmount, setSoftSkillsAmount] = useState(0);
	const location = useLocation();
	const isSkills = location.pathname === '/skills';

	const {currentUser, readUserFromCacheLoading} = useReadUser();
	const { data: user, userLoading, error } = useGetByNameUserRepo(currentUser?.currentUser.username);

	const sidebarModel = new SidebarModel();
	const courseName = getFormattedCourseName(arrCourseStudent[courseIndex]);
	const isBestHomework = false;
	// studentData.groups.map((group) => { group.bestHomeworkId === как-то найти id домашек студента})
	const lessonCount = sidebarModel.getLessonCount(studentData, arrCourseStudent[courseIndex]);
	const mentors = studentData.groups.map((group) => {
		return group.mentors;
	}).flat();

	useEffect(() => {
		setSoftSkillsAmount(studentData?.hardskill);
		setHardSkillsAmount(studentData?.hardskill);
	}, []);

	const showPrevCourse = () => {
		setCourseIndex(courseIndex - 1);
	}
	const showNextCourse = () => {
		setCourseIndex(courseIndex + 1);
	};

	const today = () => {
		const year = new Date().getFullYear();
		const day = new Date().getDate();
		const month = new Date().getMonth() + 1;
		const today = `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month
			}.${year}`;
		return today;
	}
	if (readUserFromCacheLoading || userLoading) {
		return null;
	}

	return (
		<>
			<div className="progressInfoWrapper">
				<div className="profile__upper_wraper">
					{isSkills && (
						<span className="profile__btn_back">
							<BackArrow pathName={'/profile'} />
						</span>
					)}
					<Link to="/profile-settings">
						<div className="profile__btn_settings">
							{!isSkills ? (
								<img
									className="btn_settings"
									src={SettingsPic}
									alt="settings_picture"
								/>
							) : (
								<HomeButon />
							)}
						</div>
					</Link>
				</div>
				<div className="avatarDiv">
					{isBestHomework && (
						<img className="crownIcon" src={Crown} alt="crown" />
					)}
					<DownloadAvatar />
					<div className="profileInfo">
						<div className="sidebar__userInfo_header">
							<div className="user-courses profile__user-courses">
								<button
									className="userInfo-header__button"
									onClick={showPrevCourse}
									disabled={courseIndex === 0}
								>
									<img src={roundArrow} className="profile__arrow profile__arrow_left"
										alt="arrow" />
								</button>
								<div className="profile__courseName">{arrCourseStudent[courseIndex]}</div>
								<button
									className="userInfo-header__button"
									onClick={showNextCourse}
									disabled={courseIndex === arrCourseStudent.length - 1}
								>
									<img src={roundArrow} className="profile__arrow" alt="arrow" />
								</button>
							</div>
						</div>
						<p className="profile__info_username">
							{user.user.firstName}
						</p>
						<div className="profileInfo__data">
							<div className="profile__info_course">
								<div className="profile__info_lessons">
									{/* {studentProfile.currentLesson}/ {studentProfile.durationOfStudy} */}
									{0 / lessonCount}
								</div>
								<div className="profile__info_speciality">
									<div className="profile__info_name_course">{courseName}</div>
									<div className="profile__info_date">
										{today()}
									</div>
									<div className="profile__info_progress">
										<ProgressBar
											// item={studentProfile.currentLesson}
											item={0}
											amount={lessonCount}
											percent={90}
										/>
									</div>
								</div>
							</div>
							<div className="profileInfo__mentor">
								<span className="profileInfo__teacher">
									{mentors.length === 1
										? `Преподаватель:`
										: `Преподаватели:`}
								</span>{' '}
								{mentors.map((mentor, i, arr) => (
									// <Link
									// 	to={`/teacher-info/${mentor.uid}`}
									// 	key={mentor.uid}
									// >
									<div className="profileInfo__teacherName" key={mentor.id}>
										{`${mentor.user.firstName} ${mentor.user.surname}`}
										{arr.length - 1 === i
											? `.`
											: `,`}
									</div>
									// </Link>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="profile__crystalls_wrapper" ref={step5Ref}>
					<div className="profile__crystall_hard">
						<img src={HardSkills} alt="hard-skills" />
						<div className="profile__crystall_box">
							<div className="profile__crystall_amount">
								{hardSkillsAmount || 0}
							</div>
							<div className="profile__crystall_description">
								Хард скилы
							</div>
						</div>
					</div>
					<div className="profile__crystall_soft">
						<img src={SoftSkills} alt="soft-skills" />
						<div className="profile__crystall_box">
							<div className="profile__crystall_amount">
								{softSkillsAmount || 0}
							</div>
							<div className="profile__crystall_description">
								Софт скилы
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ProgressInfo;
