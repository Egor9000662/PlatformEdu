import React, { useEffect, useState } from 'react';
import { Button, Modal, DatePicker, Space } from 'antd';
import { inject, observer } from 'mobx-react';
import selectCheckmark from '../../../assets/controls/select_checkmark.svg';
import '../Group.scss';
import AddVacations from './AddVacations';
import GroupFormModel from '../../../models/GroupFormModel';
import GroupEditingModel from "../../../models/GroupEditingModel";
import Enum from '../../../../enum';

function GroupModal({
	group,
	visible,
	handleEditVisible,
	handleDates,
	// handleDates: handleDate,
	// coursesStore,
	// mentorsStore,
	// groupsStore,
	// lessonsStore,
	// groupFormModel,
	// scheduleService,
}) {
	const [groupHolidays, setGroupHolidays] = useState([]);
	const [blocksOfCourse, setBlockOfCourse] = useState([]);
	// const [courseBlocks, setCourseBlocks] = useState([]);

	const [jobWeek, setJobWeek] = useState(0);
	const [jobDuration, setJobDuration] = useState(3);
	const [selectedCourse, setSelectedCourse] = useState(group.course);
	const [selectMentor, setSelectMentor] = useState({});
	const [isHidden, setIsHidden] = useState(false);
	const [startDate, setStartDate] = useState(group.startDate);
	const [endDate, setEndDate] = useState(group.endDate);
	const [errorMessage, setErrorMessage] = useState('');

	// const groupModel = new GroupEditingModel(group, mentorsStore, groupsStore, lessonsStore);

	// const setAllBlocks = async (courseName) => {
	// 	const blocks = await groupFormModel.getCourseBlocks(courseName);
	// 	setBlockOfCourse(blocks);
	// }

	// useEffect(() => {
	// 	if (group.course) {
	// 		setAllBlocks(selectedCourse);
	// 	}
	// }, [selectedCourse]);

	function handleSelectMentor(e) {
		if (e.target.value === '') {
			setSelectMentor({});
			return;
		}
		// const chosenMentor = mentorsStore.getMentor(e.target.value);
		// setSelectMentor(chosenMentor);
	}

	const handleEditStartDate = (date, dateString) => {
		if (dateString !== startDate) {
			setStartDate(dateString);
		}
	};

	const handleEditEndDate = (date, dateString) => {
		if (dateString !== endDate) setEndDate(dateString);
	};

	async function handleEditGroup() {
		// const validationRes = await groupModel.editGroup(
		// 	selectedCourse, startDate, groupHolidays, jobWeek, jobDuration,
		// 	selectMentor, isHidden, endDate, handleDates, handleEditVisible, setSelectMentor,
		// );
		// setErrorMessage(validationRes);
		// setSelectMentor({});
		// if (!validationRes) {
		// 	handleEditVisible(false);
		// }
	}

	const onChangeHolidays = (event) => {
		if (event.target.value) {
			setGroupHolidays({ ...groupHolidays, [event.target.name]: +event.target.value });
		} else {
			setGroupHolidays({ ...groupHolidays, [event.target.name]: Enum.defaultVacationsDuration });
		}
	};

	const onChangeJobWeek = (event) => {
		const week = +event.target.value;
		setJobWeek(week);
	};

	const onChangeJobDuration = (event) => {
		const duration = +event.target.value;
		setJobDuration(duration);
	};

	// async function editGroup() {
	// 	const schedule = await scheduleService.calculateSchedule(
	// 		selectedCourse,
	// 		startDate,
	// 		groupHolidays,
	// 	);
	// 	await groupModel.editGroup(selectedCourse, schedule, startDate, handleDates);
	// 	await groupModel.handleSelectedMentor(selectMentor, isHidden);
	// 	handleEditVisible(false);
	// }

	return (
		<>
			<Modal
				className="stdModal std-moveModal"
				title="Настройки группы"
				open={visible}
				onCancel={() => {
					handleEditVisible(false);
					setErrorMessage('');
				}}
				footer={[
					<Button
						key="back"
						onClick={() => {
							setErrorMessage('');
							handleEditVisible(false)
						}}
						className="redBtn"
					>
						Отмена
					</Button>,
					<Button
						key="submit"
						type="primary"
						onClick={handleEditGroup}
						// onClick={editGroup}

						className="greenBtn"
					>
						Ок
					</Button>,
				]}
			>
				<div className="groupModal-body">
					<p className="stdMove-heading">Изменить курс</p>
					<div className="stdMove-selectContainer">
						<select
							name="courses"
							id="selectedCourse"
							className="stdMove-select"
							onChange={(e) => setSelectedCourse(e.target.value)}
							// value={selectedCourse}
						>
							{/*{coursesStore.courses.map((item) => {*/}
							{/*	return (*/}
							{/*		<option key={item.id} value={item.id}>*/}
							{/*			{item.id}*/}
							{/*		</option>*/}
							{/*	);*/}
							{/*})}{' '}*/}
						</select>
						<img
							src={selectCheckmark}
							className="stdMove-checkMark"
						/>
					</div>
					{/*<>*/}
					{/*	{(selectedCourse !== group.course ||
							startDate !== group.startDate) && (*/}
					{/*		<ExtraCourseSettings*/}
					{/*			blocksOfCourse={courseBlocks}*/}
					{/*			onChangeHolidays={onChangeHolidays}*/}
					{/*		/>*/}
					{/*	)}*/}
					{/*</>*/}
				</div>
				<div className="groupModal-body">
					<p className="stdMove-heading">Добавить ментора</p>
					<div className="stdMove-selectContainer">
						<select
							name="mentors"
							id="selectedMentor"
							className="stdMove-select"
							onChange={handleSelectMentor}
							value={selectMentor?.uid || ''}
						>
							<option value="">Выберите ментора</option>
							{/*{mentorsStore.mentors*/}
							{/*	.filter((mentor) => !Object.keys(group.mentor).includes(mentor.id))*/}
							{/*	.map((mentor) => {*/}
							{/*		return (*/}
							{/*			<option key={mentor.uid} value={mentor.uid}>*/}
							{/*				{mentor.name}*/}
							{/*			</option>*/}
							{/*		);*/}
							{/*	})}{' '}*/}
						</select>
						<img
							src={selectCheckmark}
							className="stdMove-checkMark"
						/>
					</div>
					<div className="stdMove-blockContainer">
						<p className="stdMove-heading">
							Скрыть ментора у студентов?
						</p>
						<div className="stdMove-radioBtns">
							<span>
								<input
									type="radio"
									id="block-true"
									name="block"
									value={true}
									onChange={(e) => setIsHidden(JSON.parse(e.target.value))}
								/>
								<label htmlFor="block-true">Да</label>
							</span>
							<span>
								<input
									type="radio"
									id="block-false"
									name="block"
									value={false}
									onChange={(e) => setIsHidden(JSON.parse(e.target.value))}
								/>
								<label htmlFor="block-false">Нет</label>
							</span>
						</div>
					</div>
				</div>
				<div className="groupModal-body">
					<p className="stdMove-heading">Изменить текущие даты</p>
					<Space direction="vertical">
						<DatePicker
							placeholder={startDate}
							onChange={handleEditStartDate}
							className="createGroup-input"
						/>
					</Space>
					<Space direction="vertical">
						<DatePicker
							placeholder={endDate}
							onChange={handleEditEndDate}
							className="createGroup-input"
						/>
					</Space>
					<>
						{(selectedCourse !== group.course ||
							startDate !== group.startDate) && (
								<AddVacations
									blocksOfCourse={blocksOfCourse}
									onChangeHolidays={onChangeHolidays}
									defaultVacationsDuration={Enum.defaultVacationsDuration}
								/>
							)}
					</>
					{errorMessage && (
						<p className="vacation-error">{errorMessage}</p>
					)}
				</div>
			</Modal>
		</>
	);
}

export default GroupModal;
