import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Home from '../Home/Home';
import GroupPage from '../GroupPage/GroupPage';
import TabbedPane from '../../components/TabbedPane/TabbedPane';
import PaymentPage from '../PaymentPage/PaymentPage';
import StudentProfile from '../../../teacher/pages/StudentProfile/StudentProfile';
import FeedbackInfoPage from '../FeedbackInfoPage/FeedbackInfoPage';
import MentorsProgress from '../MentorsProgress/MentorsProgress';
import MentorListPage from '../MentorListPage/MentorListPage';
import EvaluationTable from '../../../common/pages/Evaluation/EvaluationTable';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import CreateNotice from "../../../common/pages/CreateNotice/CreateNotice";
import HomeworkChatPage from "../../../common/pages/HomeworkChatPage/HomeworkChatPage";
import AddCoursePage from '../CreateCourse/AddCoursePage';
import TestsConstructor from '../TestsConstructor/TestsConstructor';
import TestsPage from '../TestsPage/TestsPage';

export default function AppAdmin({ groups, userId }) {
	let location = useLocation();
	const tabNeeded = ['/groups', '/feedback', '/payment', '/mentor-progress'];
	return (
		<>
			<Switch>
				<Route exact path="/groups">
					<Home groups={groups}  userId={userId}/>
				</Route>
				<Route path="/groups/:id">
					<GroupPage groups={groups} />
				</Route>
				{/*<Route path="/feedback">*/}
				{/*	<FeedbackInfoPage />*/}
				{/*</Route>*/}
				{/*<Route path="/payment">*/}
				{/*	<PaymentPage />*/}
				{/*</Route>*/}
				{/*<Route exact path="/constructor">*/}
				{/*	<AddCoursePage />*/}
				{/*</Route>*/}
				{/*<Route exact path="/constructor/test-form">*/}
				{/*	<TestsConstructor />*/}
				{/*</Route>*/}
				{/*<Route path="/tests">*/}
				{/*	<TestsPage />*/}
				{/*</Route>*/}
				{/*<Route path="/mentor-progress">*/}
				{/*	<MentorsProgress />*/}
				{/*</Route>*/}
				{/*<Route path="/mentor-list">*/}
				{/*	<MentorListPage />*/}
				{/*</Route>*/}
				{/*<Route exact path={'/student-profile/:id'}>*/}
				{/*	<StudentProfile />*/}
				{/*</Route>*/}
				{/*<Route path="/create-notification">*/}
				{/*	<CreateNotice role={'admin'} />*/}
				{/*</Route>*/}
				{/*<Route exact path="/student-profile/:id">*/}
				{/*	<StudentProfile />*/}
				{/*</Route>*/}
				{/*<Route path="/chat/:id/:taskId">*/}
				{/*	<HomeworkChatPage role="admin" />*/}
				{/*</Route>*/}

				<Redirect to="/groups" />
			</Switch>
			<div
				className={
					tabNeeded.some((path) => path === location.pathname)
						? 'lowerSide'
						: 'none'
				}
			>
				{/*<TabbedPane*/}
				{/*	paths={[*/}
				{/*		'/groups',*/}
				{/*		'/feedback',*/}
				{/*		'/payment',*/}
				{/*		'/mentor-progress',*/}
				{/*	]}*/}
				{/*/>*/}
			</div>
		</>
	);
}
