import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Home from '../Home/Home';
import GroupPage from '../GroupPage/GroupPage';
import Lessons from '../../components/Lessons/Lessons';
import GroupMeeting from '../../../common/pages/GroupMeeting/GroupMeeting';
import EvaluationTable from '../../../common/pages/Evaluation/EvaluationTable';
import EstimationWindow from '../../components/EstimationWindow/EstimationWindow';
import StudentProfile from '../StudentProfile/StudentProfile';
import LessonTasksInfo from '../../components/LessonTasksInfo/LessonTasksInfo';
import CreateNotice from '../../../common/pages/CreateNotice/CreateNotice';
import HomeworkChatPage from '../../../common/pages/HomeworkChatPage/HomeworkChatPage';
import MessengerPage from '../../../common/pages/MessengerPage/MessengerPage';
import QueuePage from '../QueuePage/QueuePage';
import TaskPage from '../TaskPage/TaskPage';

export default function AppTeacher() {
	return (
		<Switch>
			<Route exact path="/groups">
				<Home />
			</Route>
			<Route path="/groups/:id">
				<GroupPage />
			</Route>
			<Route path="/lessons/:course/:lessonId/:taskId">
				<TaskPage />
			</Route>
			<Route path="/lessons">
				<Lessons />
			</Route>
			<Route exact path="/student-profile/:id">
				<StudentProfile />
			</Route>
			<Route path="/evaluation/:id">
				<EvaluationTable />
			</Route>
			<Route path="/group-meeting">
				<GroupMeeting />
			</Route>
			<Route path="/estimation/:uid/:lessonNumber/:taskId">
				<EstimationWindow />
			</Route>
			<Route path="/student-profile/:id/:lessonId">
				<LessonTasksInfo />
			</Route>
			<Route path="/chat/:id/:taskId">
				<HomeworkChatPage role="teacher" />
			</Route>
			<Route path="/create-notification">
				<CreateNotice role={'teacher'} />
			</Route>
			<Route path="/messenger">
				<MessengerPage />
			</Route>
			<Route path="/tasks-queue">
				<QueuePage />
			</Route>
			<Redirect to="/groups" />
		</Switch>
	);
}
