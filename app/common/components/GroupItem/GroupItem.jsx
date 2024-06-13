import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { bool, string } from "prop-types";
import { Button, Card, Modal } from "antd";
import FrontendAvatar from "../../assets/defaultAvatars/frontend-avatar.png";
import Counter from "../Counter/Counter";
import { InboxOutlined } from "@ant-design/icons";
import iconDelete from "../../assets/controls/icon-delete.svg";
import GroupItemModel from "../../models/GroupItemModel";
import './GroupItem.scss'
import Enum from '../../../enum';
import {useDeleteGroupRepo, useLoadStudentOfGroupRepo} from "../../repositories/GroupRepository";

function GroupItem(props) {
	const {
		role,
		group,
		setIsModalArchiveVisible,
		setIsModalGrRemoveVisible,
	} = props;

	const [isModalArchiveVisible, setIsModalGroupArchiveVisible] = useState(false);
	const [isModalGroupRemoveVisible, setIsModalGroupDeleteVisible] = useState(false);
	const [unseenStudents, setUnseenStudents] = useState(0);

	const {data:students, studentsLoading} = useLoadStudentOfGroupRepo();
	const [deleteGroup, deleteGroupError] = useDeleteGroupRepo();
	const data = {};
	data.students = [];
	// useEffect(() => {
	// 	const getGroupStudents = async () => {
	// 		await group.getStudents();
	// 	}
	// 	getGroupStudents();
	// }, [group.id]);

	// const groupItem = new GroupItemModel(usersStore, group);

	// useEffect(() => {
	// 	setUnseenStudents((prev) => (prev = groupItem.unseenStudents.length));
	// }, [groupItem.unseenStudents.length > 0]);

	if (role === 'admin') {
		useEffect(() => {
			setIsModalArchiveVisible(isModalArchiveVisible);
	    }, [isModalArchiveVisible]);

		useEffect(() => {
			setIsModalGrRemoveVisible(isModalGroupRemoveVisible);
		}, [isModalGroupRemoveVisible]);
	}

	// useEffect(() => {
	// 	if (group.pausedLesson) {
	// 		groupItem.removePausedWeek(group.pausedLesson);
	// 	}
	// }, [group.id, group.pausedLesson])
	//
	// let className = 'card';
	// if (group.pausedLesson) {
	// 	className += ' groupVacation';
	// }
	// if (groupItem.dayDifference > 0) {
	// 	className += ' graduated';
	// }
	// let classNameCounter = 'card-counter';
	// if (!group.startDate || group.archived) {
	// 	className += ' unassigned';
	// 	classNameCounter += ' hidden';
	// }

	// const showModalArchive = (event) => {
	// 	event.preventDefault();
	// 	setIsModalGroupArchiveVisible(true);
	// };
	const showModalGroupRemove = (event) => {
		event.preventDefault();
		setIsModalGroupDeleteVisible(true);
	};
	// const archiveGroup = async () => {
	// 	await group.setArchived(group.id, !group.archived);
	// 	setIsModalGroupArchiveVisible(false);
	// };
	function deleteThisGroup(id) {
		deleteGroup({
			variables: {
				id,
			}
		})
		setIsModalGroupDeleteVisible(false);
	}

	if (studentsLoading) {
		return null;
	}
	return (
		// <Card className={className}>
		<Card className='card'>

			<div className="card-container">
				{data.students.map((user, uid) => (
					<img
						key={uid}
						src={user.avatarURL ? user.avatarURL : FrontendAvatar}
						alt="student"
					/>
				))}
				{data.students.length < Enum.avatarCount
					? Array.from(Array(Enum.avatarCount - data.students.length), (_, i) => (
						<img key={i} src={FrontendAvatar}/>
					))
					: null}
				<div className="card-center">
				<span
					className={group.pausedLesson ? 'groupVacationText' : 'hidden'} //todo:дописать методы получения данных о паузе
				>
					Каникулы
				</span>
					{/*{role === 'teacher'*/}
					{/*	? <div className={classNameCounter}>*/}
					{/*		<Counter num={unseenStudents || 0} />*/}
					{/*	</div>*/}
					{/*	: null*/}
					{/*}*/}

					<p className="course-title">{group.name}</p>
					<p className="data">{group.startDate.split(' ')[0]}</p>
					{group.weekNumber &&
						<p className="data">Неделя {group.weekNumber}</p>
					}
					{role === 'admin' &&
						 Object.entries(group.mentors).length === 0 && group.name !== 'TestGroup'
						? !group.mentors.length &&
							<p className="groupCard-mentor">Выберите ментора</p>
						: null
					}
				</div>
			</div>
			{role === 'admin'
				? <div className="groupButtons-container">
					{/*<button*/}
					{/*	type="button"*/}
					{/*	onClick={showModalArchive}*/}
					{/*	className="groupButtons"*/}
					{/*>*/}
					{/*	<InboxOutlined*/}
					{/*		className={*/}
					{/*			group.archived*/}
					{/*				? 'groupIcon-archive faded'*/}
					{/*				: 'groupIcon-archive'*/}
					{/*		}*/}
					{/*	/>*/}
					{/*</button>*/}
					{/*<Modal*/}
					{/*	className="groupModal group-archiveModal"*/}
					{/*	title={*/}
					{/*		group.archived*/}
					{/*			? `Разархивировать группу ${group.id}`*/}
					{/*			: `Архивировать группу ${group.id}`*/}
					{/*	}*/}
					{/*	open={isModalArchiveVisible}*/}
					{/*	onOk={() => setIsModalGroupArchiveVisible(false)}*/}
					{/*	onCancel={() => setIsModalGroupArchiveVisible(false)}*/}
					{/*	footer={[*/}
					{/*		<Button*/}
					{/*			key="back"*/}
					{/*			onClick={() => setIsModalGroupArchiveVisible(false)}*/}
					{/*			className="redBtn"*/}
					{/*		>*/}
					{/*			Упс, нет*/}
					{/*		</Button>,*/}
					{/*		<Button*/}
					{/*			key="submit"*/}
					{/*			type="primary"*/}
					{/*			onClick={archiveGroup}*/}
					{/*			className="greenBtn"*/}
					{/*		>*/}
					{/*			{group.archived ? 'Разархивировать' : 'Архивировать'}*/}
					{/*		</Button>,*/}
					{/*	]}*/}
					{/*>*/}
					{/*	<span>Хорошо подумали?</span>*/}
					{/*</Modal>*/}
					<button
						type="button"
						className={
							group.archived
								? 'groupButtons-delete groupButtons faded'
								: 'groupButtons-delete groupButtons'
						}
						onClick={showModalGroupRemove}
					>
						<img src={iconDelete} alt="delete" />
					</button>
					<Modal
						className="groupModal  group-removeModal"
						title={`Удалить группу ${group.name}`}
						open={isModalGroupRemoveVisible}
						onOk={() => setIsModalGroupDeleteVisible(false)}
						onCancel={() => setIsModalGroupDeleteVisible(false)}
						footer={[
							<Button
								key="back"
								onClick={() => setIsModalGroupDeleteVisible(false)}
								className="redBtn"
							>
								Упс, нет
							</Button>,
							<Button
								key="submit"
								type="primary"
								onClick={()=>deleteThisGroup(group.id)}
								className="greenBtn"
							>
								Удаляем
							</Button>,
						]}
					>
						<span>Хорошо подумали?</span>
					</Modal>
				</div>
				: null
			}
		</Card>
	);

}
export default GroupItem;

GroupItem.propTypes = {
	course: string,
	startDate: string,
	archived: bool,
};

GroupItem.defaultProps = {
	course: 'Учебная группа',
	startDate: 'дата старта потока',
	mentor: 'Наставница группы',
	archived: false,
};
