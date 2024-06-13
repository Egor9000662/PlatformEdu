import React, { useEffect, useState } from 'react';
import { string, number } from 'prop-types';
import {Button, Modal, Tooltip} from 'antd';
import { inject, observer } from 'mobx-react';
import iconEdit from '../../assets/controls/icon-edit.svg';
import iconDelete from '../../assets/controls/icon-delete.svg';
import iconPause from '../../assets/controls/pause_icon.svg';
import iconCopy from '../../assets/controls/icon-copy-24.png'
import selectCheckmark from '../../assets/controls/select_checkmark.svg';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import GroupModal from './GroupModals/GroupModal';
import getDateEndGroup from "../../template/getDateEndGroup";
import './Group.scss';
import GroupEditingModel from "../../models/GroupEditingModel";
import { formatDate } from '../../../modules/format-date';
import RegistrationLink from "../../AppLogic/admin/RegistrationLink";

function Group({ group, registrationLink }) {

	// const groupModel = new GroupEditingModel(group, mentorsStore, groupsStore, lessonsStore);
	// const scheduleService = createScheduleServiceFactory(lessonsStore, group)

	const [isModalDeleteMentorVisible, setIsModalDeleteMentorVisible] = useState(false);
	const [deletedMentor, setDeletedMentor] = useState(null);
	const [groupStartDate, setGroupStartDate] = useState(undefined);
	const [groupEndDate, setGroupEndDate] = useState(undefined);
	const [isModalPauseGroupVisible, setIsModalPauseGroupVisible] = useState(false);
	const [pausedWeeksNum, setPausedWeeksNum] = useState('');
	const [studyStart, setStudyStart] = useState(null);
	const [disabledVacations, setDisabledVacations] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [deletePauseModal, setDeletePauseModal] = useState(false);
	const [isLink, setIsLink] = useState(false);
	const [link, setLink] = useState(undefined);
	const [error, setError] = useState(false);
	const [isTooltip, setIsTooltip] = useState(false);

	useEffect(() => {
		setGroupStartDate(group.startDate);
	}, [group.startDate]);
	useEffect(() => {
		setGroupEndDate(group.endDate);
	}, [group.endDate]);

	const showEditModal = (value) => {
		setEditModalVisible(value);
	};

	function handleDates(start, end) {
		setGroupStartDate(start);
		setGroupEndDate(end);
	}

	// useEffect(() => {
	// 	groupModel.getEndDateOfVacation(setDisabledVacations, setStudyStart);
	// }, [pausedWeeksNum, group.pausedLesson]);

	// async function handleOkPauseGroup() {
	// 	// await groupModel.pauseGroup(pausedWeeksNum);
	// 	const date  = groupModel.getEndDateOfVacation(setDisabledVacations, setStudyStart)
	// 	await scheduleService.updateSchedule(group.week?.weekNumber, pausedWeeksNum, date);
	// 	group.setLoaded(false);
	// 	setPausedWeeksNum('');
	// 	setIsModalPauseGroupVisible(false);
	// 	setError(false);
	// }

	function handleCancelPauseGroup() {
		setIsModalPauseGroupVisible(false);
		setError(false);
	}

	const pausedLessonsHandler = (e) => {
		const lessons = e.target.value;
		if (lessons >= 0) {
			setError(false);
			setPausedWeeksNum(lessons);
		} else {
			setError(true);
		}
	};

	// async function getGroupDateEnd(group) {
	// 	setGroupEndDate(getDateEndGroup(group.schedule))
	// }
	// useEffect(()=>{
	// 	getGroupDateEnd(group);
	// }, [groupStartDate, pausedWeeksNum, group.schedule]);

	// const handlerDeletePausedLesson = async () => {
	// 	await scheduleService.deletePausedLesson();
	// 	group.setLoaded(false);
	// 	setDeletePauseModal(false);
	// };
	return (
		<div className="container-group">
			<div>
				<BackArrow pathName={'/groups'} />
				<div className="container-group__info">
					<div className="container-group__edit">
						<h2 className="container-line">
							{group.name}({group.course.name})
						</h2>
					{/*	<button*/}
					{/*		type="button"*/}
					{/*		onClick={() => showEditModal(true)}*/}
					{/*		style={{ boxShadow: 'none' }}*/}
					{/*	>*/}
					{/*		<img className="icon" src={iconEdit} alt="edit" />*/}
					{/*	</button>*/}
					{/*	<GroupModal*/}
					{/*		group={group}*/}
					{/*		visible={editModalVisible}*/}
					{/*		handleEditVisible={showEditModal}*/}
					{/*		handleDates={handleDates}*/}
					{/*	/>*/}
					</div>
					<p>
						Текущий урок:
						<span className="container-span">
							{' № '}
							{/*{group.week?.weekNumber}*/}
							{0}
							{/*{' ('}*/}
							{/*{currentLesson ? currentLesson.title : null}*/}
							{/*{' )'}*/}
						</span>
						{/*<button*/}
						{/*	type="button"*/}
						{/*	onClick={() => setIsModalPauseGroupVisible(true)}*/}
						{/*	style={{ boxShadow: 'none' }}*/}
						{/*	className={disabledVacations ? 'noSchedule' : ''}*/}
						{/*	disabled={disabledVacations}*/}
						{/*>*/}
						{/*	<img className="icon" src={iconPause} alt="pause" />*/}
						{/*</button>*/}
						{group.pausedLesson && (
							<>
								<span className="group-pausedText">
									Каникулы до {studyStart}
								</span>
								<button
									type="button"
									onClick={() => setDeletePauseModal(true)}
									style={{ boxShadow: 'none' }}
								>
									<img
										className="icon"
										src={iconDelete}
										alt="delete"
									/>
								</button>
								<Modal
									className="stdModal std-moveModal"
									onCancel={() => setDeletePauseModal(false)}
									title="Удалить паузу у группы?"
									open={deletePauseModal}
									footer={[
										<Button
											key="back"
											onClick={() =>
												setDeletePauseModal(false)
											}
											className="redBtn"
										>
											Отмена
										</Button>,
										<Button
											key="submit"
											type="primary"
											// onClick={handlerDeletePausedLesson}
											className="greenBtn"
										>
											Ок
										</Button>,
									]}
								></Modal>
							</>
						)}
						<Modal
							className="stdModal std-moveModal"
							onCancel={handleCancelPauseGroup}
							title="Добавить паузу группе?"
							open={isModalPauseGroupVisible}
							footer={[
								<Button
									key="back"
									onClick={handleCancelPauseGroup}
									className="redBtn"
								>
									Отмена
								</Button>,
								<Button
									key="submit"
									type="primary"
									// onClick={handleOkPauseGroup}
									className="greenBtn"
								>
									Ок
								</Button>,
							]}
						>
							<div className="pausedModal-container">
								<p> Укажите количество недель остановки</p>
								<input
									onChange={pausedLessonsHandler}
									value={pausedWeeksNum}
									name="pausedWeeksNum"
									type="number"
									placeholder="0"
									className="createGroup-input"
								/>
							</div>
							{error && (
								<div className="pausedModal-container__error-message">
									Количество недель должно быть положительным
									числом
								</div>
							)}
						</Modal>
					</p>
					<p>
						Наставница:{' '}
						{
							group.mentors
							?<span className="container-span">
								{Object.values(group.mentors).map((item) => (
									<span
										key={item.id}
										// className={groupModel.getMentorClassName(item)}
									>
										{item.mentorName}{' '}
									</span>
								))}
							</span>
							: ''
						}
						{Object.keys(group.mentors).length
							? <button
								type="button"
								onClick={() => setIsModalDeleteMentorVisible(true)}
								style={{ boxShadow: 'none' }}
							>
								<img
									className="icon"
									src={iconDelete}
									alt="delete"
								/>
							</button>
							: null
						}

						{/*<Modal*/}
						{/*	className="stdModal std-moveModal"*/}
						{/*	title="Удалить ментора"*/}
						{/*	open={isModalDeleteMentorVisible}*/}
						{/*	onOk={() => setIsModalDeleteMentorVisible(false)}*/}
						{/*	onCancel={() => setIsModalDeleteMentorVisible(false)}*/}
						{/*	footer={[*/}
						{/*		<Button*/}
						{/*			key="back"*/}
						{/*			onClick={() => setIsModalDeleteMentorVisible(false)}*/}
						{/*			className="redBtn"*/}
						{/*		>*/}
						{/*			Отмена*/}
						{/*		</Button>,*/}
						{/*		<Button*/}
						{/*			key="submit"*/}
						{/*			type="primary"*/}
						{/*			onClick={*/}
						{/*				() => groupModel.deleteMentor(deletedMentor, setIsModalDeleteMentorVisible)*/}
						{/*			}*/}
						{/*			className="greenBtn"*/}
						{/*		>*/}
						{/*			Ок*/}
						{/*		</Button>,*/}
						{/*	]}*/}
						{/*>*/}
						{/*	<div className="stdMove-selectContainer">*/}
						{/*		<select*/}
						{/*			name="mentors"*/}
						{/*			id="selectedMentor"*/}
						{/*			className="stdMove-select"*/}
						{/*			onChange={*/}
						{/*				(e) => groupModel.handleSelectMentor(e, setDeletedMentor)*/}
						{/*			}*/}
						{/*		>*/}
						{/*			<option value="0">Выберите ментора</option>*/}
						{/*			{Object.values(group.mentor).map((mentor) => {*/}
						{/*				return (*/}
						{/*					<option*/}
						{/*						key={mentor.uid}*/}
						{/*						value={mentor.uid}*/}
						{/*					>*/}
						{/*						{mentor.name}*/}
						{/*					</option>*/}
						{/*				);*/}
						{/*			})}{' '}*/}
						{/*		</select>*/}
						{/*		<img*/}
						{/*			src={selectCheckmark}*/}
						{/*			className="stdMove-checkMark"*/}
						{/*		/>*/}
						{/*	</div>*/}
						{/*</Modal>*/}
					</p>
					<p>
						Даты:{' '}
						<span className="container-span">
							{formatDate(new Date (group.startDate))}
							{' - '}
							{group.endDate
								?formatDate(new Date (group.endDate))
								:''
							}
						</span>
					</p>
				</div>
			</div>
			<section className="group__link-container">
				<button
					className="button__link"
					onClick={()=>registrationLink.generateLink(setLink, setIsLink)}
				>
					Сгенерировать ссылку
				</button>
				{isLink &&
					<div className="group__link-icon-text-container">
						<Tooltip
							placement="bottomRight"
							title="текст скопирован в буфер обмена"
							color="#5d9cca"
							open={isTooltip}
						>
							<img
								className="group__link_icon_copy"
								onClick={()=>registrationLink.copyLink(link, setIsTooltip)}
								src={iconCopy}
								title="Copy"
								alt="copy"
							/>
							<p className="group__link-text">{link}</p>
						</Tooltip>
					</div>
				}
			</section>
		</div>
	);
}

Group.propTypes = {
	course: string,
	startDate: string,
	endDate: string,
	title: string,
	weekNumber: number,
};

Group.defaultProps = {
	course: 'Учебная группа',
	startDate: 'дата старта потока',
	endDate: 'дата завершения потока',
	mentor: '',
	title: 'тема недели',
	weekNumber: 0,
};

export default Group;
