import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import QueueTaskCard from '../../components/QueueCard/QueueTaskCard';
import QueueMainInfoCard from '../../components/QueueCard/QueueMainInfoCard';
import './QueuePage.scss';
import MentorHomeworksQueue from "../../../common/AppLogic/teacher/MentorHomeworksQueue";
import { runInAction } from "mobx";
import clearHomeworkQueue from "../../controllers/clearHomeworkQueue";
import AddingHomeworkToQueue from "../../../common/AppLogic/common/AddingHomeworkToQueue";
import {Modal} from "antd";

function QueuePage({
	mentorId,
	homeworks,
	modules,
	mentorHomeworksQueue,
	deleteHomework,
	allHomeworks,
	usersStore,
	addHomeworkToQueue,
}) {
	const [taskIdToReturn, setTaskIdToReturn] = useState(null);
	const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

	let currentTasks = [];
	if (homeworks) {
		currentTasks = Object.entries(homeworks).map(
			([key, value]) => ({
				homeworkId: key,
				...value,
			})
		);
	}

	const returnHomeworkToQueue = async (homeworkId) => {
		const homework = currentTasks.find(
			(item) => item.homeworkId === homeworkId
		);
		const homeworkObj = {
			course: homework.course,
			lessonNumber: homework.lessonNumber,
			block: homework.block,
			taskName: homework.taskName,
			taskId: homework.taskId,
			groupId: homework.groupId,
			uid: homework.uid,
		};
		if (!addHomeworkToQueue.isValidHomeworkParameters(homeworkObj)) {
			setIsErrorModalVisible(true);
		}else {
			await addHomeworkToQueue.returnToQueue(homeworkObj);
			mentorHomeworksQueue.deleteHomeworkFromMentor(homework.homeworkId);
		}
	};

	const handleCancelHomework = async (e) => {
		const homeworkId = e.target.value;
		if(homeworkId){
			await returnHomeworkToQueue(homeworkId);
		}
	};
    useEffect(()=> {
		clearHomeworkQueue(allHomeworks, usersStore, deleteHomework)
	}, []);

	useEffect(async () => {
		if (taskIdToReturn) {
			await returnHomeworkToQueue(taskIdToReturn);
		}
	}, [taskIdToReturn]);

	return (
		<div className="queuePage">
			<div className="queuePage-header">
				<BackArrow
					className="queuePage-header__btn"
					pathName={'/messenger'}
				/>
				<h1 className="queuePage-heading">Очередь домашних заданий</h1>
			</div>
			<div className="queuePage-mainInfo">
				<QueueMainInfoCard
					freeTasksAmount={mentorHomeworksQueue.length}
					handleTakeTask={mentorHomeworksQueue.takeHomework.bind(mentorHomeworksQueue)}
					mentorId={mentorId}
					chosenModules={mentorHomeworksQueue.blocks}
					setChosenModules={(blocks) => mentorHomeworksQueue.blocks = blocks}
					modules={modules}
					maxTask={mentorHomeworksQueue.maxTasks}
					canTakeHomework={mentorHomeworksQueue.canTakeHomework}
				/>
			</div>
			<div className="queuePage-currentTasks">
				<h2 className="queuePage-heading"> Ваши полученные задания</h2>
				{currentTasks &&
					currentTasks.reverse().map((task) => (
						<QueueTaskCard
							key={task.homeworkId}
							task={task}
							setTaskIdToReturn={setTaskIdToReturn}
							handleCancelHomework={handleCancelHomework}
						/>
					))}
			</div>
			<Modal
				className="progressDay-modal"
				open={isErrorModalVisible}
				onCancel={() => setIsErrorModalVisible(false)}
				title={'Упс!'}
				footer={null}
			>
				<p> Что-то пошло не так. Попробуй перезагрузить страницу и вернуть задание ещё раз. </p>
			</Modal>
		</div>
	);
}

export default inject(
	({ homeworksStore, mentorsStore, auth, oneMentorStore, lessonsStore, usersStore, hometaskChatStore, progressStore }) => {
		const {
			loadData: loadHomeworks,
			isLoaded,
			homeworks: allHomeworks,
			deleteHomework,
		} = homeworksStore;
		const { user } = auth;
		const { getBlocks } = lessonsStore;
		const { getMentor, loadData: loadMentors } = mentorsStore;
		const {
			deleteHomeworkFromMentor,
			homeworks,
		} = oneMentorStore;

		const mentor = getMentor(user.uid);
		const [allModules, setAllModules] = useState([]);
		const modules = [...new Set(allModules)].filter(
			(el) => el !== 'Трудоустройство'
		);
		useEffect(()=>{
			usersStore.loadData();
		}, [])
		useEffect(() => {
			loadHomeworks();
		}, [isLoaded, allHomeworks]);

		useEffect(() => {
			loadMentors();
		}, [isLoaded]);

		useEffect(() => {
			if (mentor.id) {
				oneMentorStore.id = mentor.id;
				runInAction(async () => {
					await oneMentorStore.loadData();
					await oneMentorStore.getHomeworks(mentor.id);
				});
			}
		}, [mentor.id]);

		const mentorHomeworksQueue = new MentorHomeworksQueue(
			homeworksStore,
			oneMentorStore,
		);

		const mentorCourses = JSON.parse(JSON.stringify(mentor?.courses)).map(
			(el) => el.id
		);
		useEffect(() => {
			(async () => {
				const promises = mentorCourses.map(course => getBlocks(course));
				const mentorCoursesBlocks = (await Promise.all(promises)).flat(1);
				setAllModules(mentorCoursesBlocks);
			})();
		}, [mentor]);

		const addHomeworkToQueue = new AddingHomeworkToQueue(hometaskChatStore, progressStore, homeworksStore);

		return {
			mentorId: mentor.id,
			homeworks,
			deleteHomeworkFromMentor,
			isLoaded,
			modules,
			mentorHomeworksQueue,
			deleteHomework,
			allHomeworks,
			usersStore,
			addHomeworkToQueue,
		};
	}
)(observer(QueuePage));
