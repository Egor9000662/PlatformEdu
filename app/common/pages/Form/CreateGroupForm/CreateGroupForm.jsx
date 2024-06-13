import React, {useEffect, useState} from 'react';
import {DatePicker, Modal, Space} from 'antd';
import selectCheckmark from '../../../assets/controls/select_checkmark.svg';
import Button from '../../../components/Button/Button';
import './CreateGroupForm.scss';
import {useCreateGroupMentorRepo, useCreateGroupRepo} from "../../../repositories/GroupRepository";
import {useLoadAllCoursesRepo} from "../../../repositories/CoursesRepository";
import {useLoadAllMentorRepo} from "../../../repositories/MentorRepository";
import {useLoadAllBlock} from "../../../repositories/BlockRepository";
import AddVacations from "../../../components/Group/GroupModals/AddVacations";
import Enum from "../../../../enum";


const CreateGroupForm = () => {
	const workspaceID = "92426620-ffe0-457b-9818-c683b59c88d4";
	const {data:courses, coursesLoading, coursesError} = useLoadAllCoursesRepo(workspaceID);
	const {data:allMentors, mentorsLoading, mentorsError} = useLoadAllMentorRepo(workspaceID);
	// const [createGroupMentor, groupMentorTableId, groupMentorLoading, createGroupMentorError] = useCreateGroupMentorRepo();


	const [groupName, setGroupName] = useState('');
	const [courseName, setCourseName] = useState({
		name: '',
		courseId: '',
		workspaceId: '',
	});
	const [createGroup, newGroupId, createGroupLoading, createGroupError] = useCreateGroupRepo(allMentors, courseName.workspaceId);

	const [mentor, setMentor] = useState(null);
	const [courseStartDate, setCourseStartDate] = useState('');
	const [courseEndDate, setCourseEndDate] = useState('');
	const [groupVacations, setGroupVacations] = useState({});
	const [groupVacationsModal, setGroupVacationsModal] = useState({});
	const [modalVacationsOpen, setModalVacationsOpen] = useState(false);
	const [error, setError] = useState('');
	const [errorEmtyInput, setErrorEmtyInput] = useState(false);

	const defaultVacationsDuration = 0;

	const {blocks, blocksLoading} = useLoadAllBlock(courseName, courseName.courseId, workspaceID);

	// const [errorShown, setErrorShown] = useState('');
	// const [groupHolidays, setGroupHolidays] = useState([]);
	// const [groupHolidaysInfo, setGroupHolidaysInfo] = useState('');
	// const [modalHolidaysOpen, setModalHolidaysOpen] = useState(false);
	// const [blocksOfCourse, setBlockOfCourse] = useState([]);
	// const employment = "Трудоустройство";

	// useEffect(() => {
	// 	if(newGroupId){
	// 		const mentor = allMentors.find(mentor => mentor.mentorName === mentor);
	// 		createGroupMentor({
	// 			variables: {
	// 				groupId: newGroupId,
	// 				mentorId: mentor.id,
	// 				workspaceId: courseName.workspaceId
	// 			}
	// 		})
	// 	}
	// }, [newGroupId])

	const courseHandler = (event) => {
		const chooseCourse = courses.courses.find(course => course.name === event.target.value);
		const name = event.target.value;
		const courseId = chooseCourse.id;
		const workspaceId = chooseCourse.workspace.id;
		setCourseName({...courseName, name, courseId, workspaceId});
	}

	const mentorNameHandler = (e) => {
		if (e.target.value === '0') {
			setMentor(null);
			return;
		}
		setMentor(e.target.value);
	};

	const onChangeVacations = (event, block) => {
		if (event.target.value) {
			setGroupVacationsModal({ ...groupVacationsModal, [block]: +event.target.value });
		} else {
			setGroupVacationsModal({ ...groupVacationsModal, [block]: defaultVacationsDuration });
		}
	};

	const courseStartDateHandler = (date, dateString) => setCourseStartDate(dateString);
	const courseEndDateHandler = (date, dateString) => setCourseEndDate(dateString);
	const handleOk = () => {
		setGroupVacations(groupVacationsModal);
		setModalVacationsOpen(false);
	};
	const handleCancel = () => {
		setGroupVacationsModal(groupVacations);
		setModalVacationsOpen(false);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const paymentDate = new Date(courseStartDate);
		paymentDate.setMonth(paymentDate.getMonth() + 1);
		const date = paymentDate.toISOString();
		try{
			createGroup({
				variables: {
					groupCreateRequestDto: {
						workspaceId: courseName.workspaceId,
						name: groupName,
						courseId: courseName.courseId,
						statusName: "active",
						startDate: new Date(courseStartDate).toISOString(),
						endDate: new Date(courseEndDate).toISOString(),
						paymentDate: date
					}
				}
			});
		}catch (error) {
				console.log(`Error: ${error}`)
		}
	}

	if(coursesLoading || mentorsLoading || blocksLoading) {
		return null;
	}
	if(createGroupError) {
		return <p style={{"color": "white"}}>Ошибка при создании группы...</p>
	}

	return (
		<form className="form-createGroup" onSubmit={handleSubmit}>
			<h1 className="createGroup-title">Создадим группу</h1>
			<input
				onChange={(event) => setGroupName(event.target.value.trim())}
				value={groupName}
				name="groupName"
				type="text"
				placeholder="Название группы"
				minLength="2"
				maxLength="20"
				className="createGroup-input"
			/>
			<div className="createGroup-selectContainer">
				<select
					onChange={(event) => courseHandler(event)}
					id="course"
					className="createGroup-select createGroup-input"
					name="courseName"
				>
					<option value="0">Выберите курс</option>
					{courses.courses.map((course) => (
						<option key={course.id} value={course.name}>
							{course.name}
						</option>
					))}

				</select>
				<img src={selectCheckmark} className="createGroup-checkMark"/>
			</div>
			<div className="createGroup-selectContainer">
				<select
					onChange={mentorNameHandler}
					id="mentor"
					name="mentor"
					className="createGroup-select createGroup-input"
				>
					{allMentors.mentors.length
						? <option value="0">Выберите ментора</option>
						: <option value="0">Пока нет менторов</option>
					}
					{allMentors.mentors
						.map((mentor) => (
							<option key={mentor.id} value={mentor.name}>
								{mentor.mentorName}
							</option>
						))
					}
				</select>
				<img src={selectCheckmark} className="createGroup-checkMark"/>
			</div>

			<Space direction="vertical">
				<DatePicker
					onChange={courseStartDateHandler}
					placeholder="Начало курса"
					className="createGroup-input"
					name="courseStartDate"
				/>
			</Space>
			<Space direction="vertical">
				<DatePicker
					onChange={courseEndDateHandler}
					placeholder="Конец курса"
					className="createGroup-input"
					name="courseEndDate"
				/>
			</Space>
			<input
				onClick={() => setModalVacationsOpen(true)}
				// defaultValue={Object.entries(groupVacations).map(([block, duration]) => `${block}: ${duration} `)}
				defaultValue={Object.entries(groupVacations).map(([block, duration]) => `${block}: ${duration} `)}
				name="groupVacations"
				type="text"
				placeholder="Добавить каникулы?"
				className="createGroup-input"
			/>
			<Modal
				className="createGroup-modal"
				centered
				open={modalVacationsOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button
						key="back"
						onClick={handleCancel}
						className="createGroup-btn _back-btn"
						text="Отмена"
					/>,
					<Button
						key="submit"
						onClick={handleOk}
						className="createGroup-btn _forward-btn"
						text="OK"
					/>,
				]}
			>
				<div className="createGroup-modal">
					<AddVacations
						blocksOfCourse={blocks}
						onChangeHolidays={onChangeVacations}
						defaultVacationsDuration={Enum.defaultVacationsDuration}
					/>
				</div>
			</Modal>
			{error && (
				<div className="authForm__error-message">{error}</div>
			)}
			<div className="createGroupButton">
				<Button className="createGroup-btn" type="submit" text={'Создать'}/>
			</div>
		</form>
	);
};

export default CreateGroupForm;

