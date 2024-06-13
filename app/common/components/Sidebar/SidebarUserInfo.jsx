import React, { useState } from "react";
import FrontendAvatar from "../../assets/defaultAvatars/frontend-avatar.png";
import roundArrow from '../../../common/assets/controls/arrows/round_arrow.svg';
import smallHardSkillsCrystall from "../../assets/сrystals/smallHardSkillsCrystall.svg";
import smallSoftSkillsCrystall from "../../assets/сrystals/smallSoftSkillsCrystall.svg";
import skillsIcon from "../../assets/controls/skills-icon.svg";
import SidebarModel from "../../models/SidebarModel";
import getFormattedCourseName from "../../template/formattedCourseName";

function SidebarUserInfo({ step5Ref, setChangeAvatar, studentData }) {

	const [courseIndex, setCourseIndex] = useState(0);

    const sidebarModel = new SidebarModel();
	const coursesArr = studentData.courses.map((course) => course.name);
	const arrCourseStudent = [...coursesArr]; // надо будет создать такой массив курсов студент

	const courseName = getFormattedCourseName(arrCourseStudent[courseIndex]);
	const lessonCount = sidebarModel.getLessonCount(studentData, arrCourseStudent[courseIndex]);

	const showNextCourse = (newIndex) => {
		setCourseIndex(newIndex);
	};

	return (
		<section className=" sidebar__nav-container sidebar__userInfo">
			<button onClick={() => setChangeAvatar(true)}>
				<img
					className="user__avatar-img"
					// src={profile.avatarURL ? profile.avatarURL : FrontendAvatar}
					src={FrontendAvatar}
					title="Сменить аватар"
					alt="avatar"
				/>
			</button>
			<div className="sidebar__userInfo-container">
				<div className="sidebar__userInfo_header">
					<div className="sidebar__username">{studentData.user.firstName}</div>
					<div className="user-courses">
						<button
							className="userInfo-header__button"
							onClick={()=>showNextCourse(courseIndex - 1)}
							disabled={courseIndex === 0}
						>
							<img src={roundArrow} className="userInfo__arrow userInfo__arrow_left"
								alt="arrow" />
						</button>
						<div className="userInfo-courseName">{courseName}</div>
						<button
							className="userInfo-header__button"
							onClick={()=>showNextCourse(courseIndex + 1)}
							disabled={courseIndex === arrCourseStudent.length - 1}
						>
							<img src={roundArrow} className="userInfo__arrow" alt="arrow" />
						</button>
					</div>
				</div>
				<div className="sidebar__userProgress" ref={step5Ref}>
					<div>
						<div className="userProgress-crystal">
							<img className="crystal-img" src={smallHardSkillsCrystall} alt="crystal" />
							<p className="count-crystal">{studentData.hardSkill || 0}</p>
						</div>
						<p className="crystal-text">HardSkills</p>
					</div>
					<div>
						<div className="userProgress-crystal">
							<img className="crystal-img" src={smallSoftSkillsCrystall} alt="crystal" />
							<p className="count-crystal">{studentData.softSkill || 0}</p>
						</div>
						<p className="crystal-text">SoftSkills</p>
					</div>
					<div>
						<div className="userProgress-crystal">
							<img className="crystal-img" src={skillsIcon} alt="skills-icon" />
							<p className="count-crystal">0</p>
						</div>
						<p className="crystal-text">Навыки</p>
					</div>
					<div>
						<div className="userProgress-crystal">
							<p className="count-crystal">
								 0/ {lessonCount}
							</p>
						</div>
						<p className="crystal-text">Обучение</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default SidebarUserInfo;
