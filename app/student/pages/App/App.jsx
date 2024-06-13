import React, { useState, useRef, useEffect } from 'react';
import { Route, Redirect, Switch, useRouteMatch } from 'react-router-dom';
import Skills from '../../components/Skills/Skills';
import Resume from '../../components/Resume/Resume';
import Profile from '../../components/Profile/Profile';
import ProgressInfo from '../../components/ProgressInfo/ProgressInfo';
import NotionPage from '../NotionPage/NotionPage';
import NotificationPages from '../NotificationPage/NotificationPage';
import TeacherInfoPage from '../TeacherInfoPage/TeacherInfoPage';
import GameLevels from '../GameLevels/GameLevels';
import GamePage from '../GamePage/GamePage';
import TabbedPane from '../../components/TabbedPane/TabbedPane';
import TestPage from '../TestPage/TestPage';
import ProfileSettings from '../ProfileSettings/ProfileSettings';
import Background from '../../../assets/images/background-desktop.jpg';
import GroupMeeting from '../../../common/pages/GroupMeeting/GroupMeeting';
import TestResult from '../../components/TestResult/TestResult';
import HomeworkChatPage from '../../../common/pages/HomeworkChatPage/HomeworkChatPage';
import PasswordChange from '../ProfileSettings/PasswordChange/PasswordChange';
import Onboarding from '../../components/Onboarding/Onboarding';
import EmptyCoursePage from '../EmptyCoursePage/EmptyCoursePage';
import Questionnaire from '../QuestionnairePage/Questionnaire';
import QuestionnaireModal from '../../components/QuestionnaireModal/QuestionnaireModal';
import UrgentNoticePage from "../UrgentNoticesPage/UrgentNoticePage";
import MessengerPage from '../../../common/pages/MessengerPage/MessengerPage';
import Sidebar from "../../../common/components/Sidebar/Sidebar";
import StudentProgressPage from '../StudentProgressPage/StudentProgressPage';
import ChooserAvatar from "../../components/CooserAvatar/ChooserAvatar";
import './App.scss';
import { useLoadStudentRepo } from "../../../common/repositories/StudentRepository";
import { getStudentCoursesData } from "../../controllers/StudentData";
import AppStudentController from "../../controllers/AppStudentController";

export const notionPagePath = '/:course/lessons/:id/';

function AppStudent({ userId }) {
	const [isNew, setIsNew] = useState(false);
	const [questionnaire, setQuestionnaire] = useState({});
	const [requiresQuestionnaire, setRequiresQuestionnaire] = useState(false);
	//onboarding
	const [onboardingActive, setOnboardingActive] = useState(false);
	const [path, setPath] = useState('');
	const [isAvatar, setIsAvatar] = useState(localStorage.getItem('avatar'));
	const [changeAvatar, setChangeAvatar] = useState(false);
	const [courseIndex, setCourseIndex] = useState(0);

	const onboardingRef = useRef(null);
	const step2 = useRef(null);
	const step3 = useRef(null);
	const step4 = useRef(null);
	const step5 = useRef(null);
	const step6 = useRef(null);

	const isLessonPage = Boolean(useRouteMatch(notionPagePath)?.isExact);
	const isTestPage = Boolean(useRouteMatch('/:course/tests/:id')?.isExact);
	const isQuestionnairePage = Boolean(useRouteMatch('/questionnaire')?.isExact);
	const isHomeworkChatPage = Boolean(useRouteMatch('/chat/:id/:taskId')?.isExact);

	const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

	const hideTabbedPane =
		isDesktop || isLessonPage || isTestPage || isQuestionnairePage || isHomeworkChatPage ? true : false;
	const hideSidebar = isDesktop && isQuestionnairePage ? true : false;

	const course = 'frontend';

	const { data: studentData, loading, error } = useLoadStudentRepo(userId);
	const appStudentController = new AppStudentController(studentData);

	useEffect(()=>{
		if(studentData) {
			appStudentController.onboardingActive(setOnboardingActive, setIsNew);
			appStudentController.workspaceQuestionnaireDoneOrNot(setRequiresQuestionnaire, setQuestionnaire, questionnaire);
			// appStudentController.courseQuestionnaireDoneOrNot(setRequiresQuestionnaire, setQuestionnaire, questionnaire);
			//todo у нас пока нет логики прохождения анкеты по отдельному курсу
		}
	}, [studentData]);

	if (loading || !studentData) {
		return null;
	}

	const coursesArr = studentData?.studentData.courses.map((course) => course.name);
	const coursesData = getStudentCoursesData(studentData?.studentData);
	const firstBlock = coursesData[courseIndex]?.blocks[0].name;

	const pathName = isDesktop && firstBlock !== null
		? `/${coursesData?.[courseIndex].name}/game/lessons/module/${firstBlock}`
		: `/${coursesData?.[courseIndex].name}/game`;

	window.addEventListener("resize", function () {
		if (window.matchMedia("(min-width: 1024px)").matches) {
			setPath(`/${coursesData?.[courseIndex].name}/game/lessons/module/${firstBlock}`);
		} else {
			setPath(`/${coursesData?.[courseIndex].name}/game`);
		}
	});

	return (
		<>
			<div className={hideSidebar ? "app-container app-container-sidebar-hidden" : "app-container"}
			>
				<Sidebar
					step2Ref={isDesktop ? step2 : null}
					step5Ref={isDesktop ? step5 : null}
					hideSidebar={hideSidebar}
					setChangeAvatar={setChangeAvatar}
					course={`${coursesArr[courseIndex]}`}
					studentData={studentData.studentData}
				/>
				<div className="app-content">
					<Switch>
						<Route exact path="/:course/lessons/module/:id">
							<GameLevels />
						</Route>
						<Route path={isDesktop ? `/:course/game/lessons/module/:id` : `/:course/game`}>
							{course === 'course-unassigned' ? (
								<EmptyCoursePage />
							) : (
								<>
									<GamePage
										step3Ref={step3}
										step6Ref={step6}
										setCourseIndex={setCourseIndex}
										courseIndex={courseIndex}
										coursesData={coursesData}
									/>
									{/*<QuestionnaireModal*/}
									{/*	studentData={studentData}*/}
									{/*	requiresQuestionnaire={requiresQuestionnaire}*/}
									{/*	questionnaire={questionnaire}*/}
									{/*/>*/}
								</>
							)}
						</Route>
						{/*<Route exact path="/skills">*/}
						{/*	<Skills />*/}
						{/*</Route>*/}
						{/*<Route exact path="/resume">*/}
						{/*	<Resume />*/}
						{/*</Route>*/}
						{/*{isDesktop && <Route exact path="/progress/:id">*/}
						{/*	<StudentProgressPage step4Ref={step4} />*/}
						{/*</Route>}*/}
						{/*<Route exact path="/profile">*/}
						{/*	<ProgressInfo*/}
						{/*		step5Ref={isDesktop ? null : step5}*/}
						{/*		arrCourseStudent={coursesArr}*/}
						{/*		studentData={studentData.studentData}*/}
						{/*	/>*/}
						{/*	<Profile onboardingActive={onboardingActive} />*/}
						{/*</Route>*/}
						<Route path={notionPagePath}>
							<NotionPage type={'theme'} userId={userId}/>
						</Route>
						{/*<Route path="/chat/:id/:taskId">*/}
						{/*	<HomeworkChatPage role="student" />*/}
						{/*</Route>*/}
						<Route path="/profile-settings">
							<ProfileSettings />
						</Route>
						{/*<Route path="/:course/tests/:id">*/}
						{/*	<TestPage />*/}
						{/*</Route>*/}
						{/*<Route path="/teacher-info/:id">*/}
						{/*	<TeacherInfoPage />*/}
						{/*</Route>*/}
						{/*<Route path="/group-meeting">*/}
						{/*	<GroupMeeting />*/}
						{/*</Route>*/}
						{/*<Route path="/:course/notification">*/}
						{/*	<NotificationPages />*/}
						{/*</Route>*/}
						{/*<Route path="/:course/:testId/test-results">*/}
						{/*	<TestResult />*/}
						{/*</Route>*/}
						{/*<Route path="/change-password">*/}
						{/*	<PasswordChange />*/}
						{/*</Route>*/}
						<Route path="/questionnaire">
							<Questionnaire
								questionnaire={questionnaire}
								setQuestionnaire={setQuestionnaire}
							/>
						</Route>
						{/*<Route path="/:course/messenger">*/}
						{/*	<MessengerPage />*/}
						{/*</Route>*/}
						{/*<Route path="/urgent-notices">*/}
						{/*	<UrgentNoticePage />*/}
						{/*</Route>*/}
						<Redirect to={path ? path : pathName} />
					</Switch>
					{/*<div className={hideTabbedPane ? 'none' : 'lowerSide'}>*/}
					{/*	<TabbedPane*/}
					{/*		paths={[`/${coursesArr[courseIndex]}/game`, '/profile', `/${coursesArr[courseIndex]}/notification`, `/${coursesArr[courseIndex]}/messenger`]}*/}
					{/*		step2Ref={isDesktop ? null : step2}*/}
					{/*	/>*/}
					{/*</div>*/}
					<Onboarding
						active={onboardingActive}
						setActive={setOnboardingActive}
						onboardingRef={onboardingRef}
						step2Ref={step2}
						step3Ref={step3}
						step4Ref={step4}
						step5Ref={step5}
						step6Ref={step6}
						displayName={studentData.studentData.user.firstName}
						gamePagePath={path ? path : pathName}
						isDesktop={isDesktop}
						studentData={studentData}
					/>
					{/*<ChooserAvatar*/}
					{/*	setIsAvatar={setIsAvatar}*/}
					{/*	isAvatar={isAvatar}*/}
					{/*	changeAvatar={changeAvatar}*/}
					{/*	setChangeAvatar={setChangeAvatar}*/}
					{/*	studentData={studentData}*/}
					{/*	isNew={isNew}*/}
					{/*/>*/}
				</div>
			</div>
		</>
	);
}

export default AppStudent;
