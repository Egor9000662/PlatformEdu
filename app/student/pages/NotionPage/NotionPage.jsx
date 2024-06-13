import React, { useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import './NotionPage.scss';
import SendPractice from '../../components/SendPractice/SendPractice';
import ThemeFeedback from '../../components/FeedbackWindows/ThemeFeedback/ThemeFeedback';
import NotionPageHeader from './NotionPageHeader';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import BlockedLessonPage from './BlockedLessonPage/BlockedLessonPage';
import { Modal } from "antd";
import ProgressModal from "../../components/Achievement/ProgressModal/ProgressModal";
import SoftSkillsProgressModal from "../../components/Achievement/SoftSkillsProgressModal/SoftSkillsProgressModal";
import NotionPageTest from "./NotionPageTest";
import NotionCard from "../../../common/components/NotionCard/NotionCard";
import NotionPageData from "../../models/NotionPage";
import LessonPageController from "../../components/LessonPageController";
import {useGetByIdLesson} from "../../../common/repositories/LessonRepository";
import {useLoadStudentRepo} from "../../../common/repositories/StudentRepository";
import {useLoadGroupRepo} from "../../../common/repositories/GroupRepository";

function NotionPage({userId}) {
	const { course, id: lessonId } = useParams();
	const { data: studentData, loading, error } = useLoadStudentRepo(userId);

	const groups = studentData?.studentData.groups;
	const group = groups?.find(group => group.course.name === course);
	const {data:currentGroup, groupLoading, loadGroupError} = useLoadGroupRepo(group.id);

	let currentLesson = currentGroup?.group.schedules.find(item => item.lesson.id === lessonId);


	const [recordMaps, setRecordMaps] = useState([]);
	const [isTheme, setIsTheme] = useState(false);
	const [titleTask, setTitleTask] = useState(null);
	const [isProgressVisible, setProgressVisible] = useState(false);
	const [isSoftSkillsProgressVisible, setIsSoftSkillsProgressVisible] = useState(false);
	const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

	const lessonPage = new LessonPageController(currentLesson, studentData?.studentData, course, currentGroup);

	// const testProgress = progressStore.progress?.test?.[notionPage.testId];
	// const handleQuestionsClear = () => {
	// 	if (testProgress) {
	// 		progressStore.clearQuestionsInfo(student.uid, notionPage.testId);
	// 	}
	// 	localStorage.setItem('pathName', location.pathname);
	// 	localStorage.setItem('state', weekId);
	// };
	const scrollSpan = useRef();
	const handleScroll = () => {
		scrollSpan.current.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		const getTaskMaps = async () => {
			const tasks = await lessonPage.getTasksRecordsMaps(setTitleTask, setIsTheme);
			setRecordMaps(tasks);
		}
		getTaskMaps();
	}, [groupLoading])

	useEffect(() => {
		lessonPage.getNotionLink();
	}, [recordMaps]);

	// const shockModeWeeksCount = student.achievement?.shockMode?.currentValue || lesson.weekNumber;

	// const weekFormatter = new Intl.NumberFormat('ru', {
	// 	style: "unit",
	// 	unit: "week",
	// 	unitDisplay: "long"
	// });
	//
	// function showFormSendingHomework(item, lessonBlock) {
	// 	return (lessonBlock !== 'Трудоустройство' && item.type === 'soft-skills')
	// 		|| (lessonBlock !== 'Трудоустройство' && item.type === 'practice');
	// }

	if ( loading || groupLoading) {
		return null
	}
	return !lessonPage.accessGranted ? (
		<BlockedLessonPage />
	) : (
		<div className="notionPage-container">
			<NotionPageHeader block={currentLesson?.block} />
			<span ref={scrollSpan} className="np-scrollSpan" />
			{recordMaps?.map((item) => (
				<div className="notionPage-card" key={item.id}>
					<NotionCard
						recordMap={item}
						handleScroll={handleScroll}
						theme={isTheme}
						// path={item.path}
					/>
					{/*<div className="notionPage-card">*/}
					{/*	{showFormSendingHomework(item, lesson.block) && (*/}
					{/*		<SendPractice*/}
					{/*			task={item}*/}
					{/*			lesson={lesson}*/}
					{/*			progress={progressStore.progress}*/}
					{/*			uploudFileURL={uploudFileURL}*/}
					{/*			deadlineOverdue={notionPage.deadlineOverdue}*/}
					{/*			student={student}*/}
					{/*			getAnonymousChatById={chatsStore.getAnonymousChatById}*/}
					{/*			setProgressVisible={setProgressVisible}*/}
					{/*			setIsSoftSkillsProgressVisible={setIsSoftSkillsProgressVisible}*/}
					{/*			setIsErrorModalVisible={setIsErrorModalVisible}*/}
					{/*		/>)*/}
					{/*	}*/}
					{/*</div>*/}
					{/*<Modal*/}
					{/*	className="progressDay-modal"*/}
					{/*	open={isProgressVisible}*/}
					{/*	onCancel={() => setProgressVisible(false)}*/}
					{/*	title={`${shockModeWeeksCount} недель в ударном режиме!`}*/}
					{/*	footer={null}*/}
					{/*>*/}
					{/*	<ProgressModal*/}
					{/*		numberShockModeWeeks={student.achievement}*/}
					{/*		weekNumber={lesson.weekNumber}*/}
					{/*	/>*/}
					{/*</Modal>*/}
					{/*<Modal*/}
					{/*	className="progressDay-modal"*/}
					{/*	open={isSoftSkillsProgressVisible}*/}
					{/*	onCancel={() => setIsSoftSkillsProgressVisible(false)}*/}
					{/*	title={'Ура! Ты боец!'}*/}
					{/*	footer={null}*/}
					{/*>*/}
					{/*	<SoftSkillsProgressModal />*/}
					{/*</Modal>*/}
					{/*<Modal*/}
					{/*	className="progressDay-modal"*/}
					{/*	open={isErrorModalVisible}*/}
					{/*	onCancel={() => setIsErrorModalVisible(false)}*/}
					{/*	title={'Упс!'}*/}
					{/*	footer={null}*/}
					{/*>*/}
					{/*	<p> Что-то пошло не так. Попробуй перезагрузить страницу и отправить задание снова.</p>*/}
					{/*</Modal>*/}
				</div>
			))}
			{/*{lesson.block === 'Трудоустройство' &&*/}
			{/*	<p className="notionPage-message">*/}
			{/*		Домашнее задание отправь на проверку нашей HR Валентине в Slack!*/}
			{/*	</p>*/}
			{/*}*/}
			{/*{notionPage.testId && (*/}
			{/*	<NotionPageTest*/}
			{/*		key={`test-${notionPage.testId}`}*/}
			{/*		testId={notionPage.testId}*/}
			{/*		weekId={weekId}*/}
			{/*		handleQuestionsClear={handleQuestionsClear}*/}
			{/*	/>*/}
			{/*)}*/}
			{/*<div>*/}
			{/*	<ThemeFeedback*/}
			{/*		title={titleTask}*/}
			{/*		taskId={notionPage.taskId}*/}
			{/*		sendFeedback={feedbackStore.sendFeedback}*/}
			{/*		uid={student.uid}*/}
			{/*		feedbackSent={notionPage.feedbackSent}*/}
			{/*	/>*/}
			{/*</div>*/}
		</div>
	);
}

export default NotionPage;

NotionPage.propTypes = {
	/** id дефолтной страницы, которую нужно показать, если в url ничего не передано */
	defaultId: PropTypes.string,
};
