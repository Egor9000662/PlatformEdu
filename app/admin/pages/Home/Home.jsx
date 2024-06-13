// страница аккаунта русалки
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Divider, Form, Modal} from 'antd';
import LogoutButton from '../../../common/components/LogoutButton/LogoutButton';
import SignUpForm from '../../../common/pages/Form/SignUpForm/Form';
import CreateGroupForm from '../../../common/pages/Form/CreateGroupForm/CreateGroupForm';
import './Home.scss';
import iconAddUser from '../../assets/controls/icon-add-user.png';
import iconAddGroup from '../../assets/controls/icon-add-group.png';
import iconMentorList from '../../assets/controls/icon-mentor-list-50.png';
import iconAddCourse from '../../assets/controls/icon-add-course.png';
import iconTest from '../../assets/controls/icon-test.png';
import OverdueModal from '../../../common/components/OverdueModal/OverdueModal';
import ImportantNoticeIcon from '../../../common/assets/controls/important_notifs.svg';
import selectCheckmark from '../../../common/assets/controls/select_checkmark.svg';
import checkedEmail from './checkedEmail';
import bell from '../../assets/controls/bell.svg';
import { BackupManager } from "../../../common/AppLogic/admin/BackupManager";
import GroupItem from "../../../common/components/GroupItem/GroupItem";
import AdminHomePageModel from '../../models/AdminHomePageModel';

import {useLoadAllCoursesRepo} from "../../../common/repositories/CoursesRepository";
import {useLoadAllGroupsRepo} from "../../../common/repositories/GroupRepository";
import {useLoadByIdUser} from "../../../common/repositories/UserRepository";
import AdminHomeController from "../../controllers/AdminHomeController";

function HomePage({userId}) {
	const [groupType, setGroupType] = useState('');
	const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);
	const [isModalArchiveVisible, setIsModalArchiveVisible] = useState(false);
	const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] = useState(false);
	const [isModalGroupRemoveVisible, setIsModalGroupRemoveVisible] = useState(false);
	const [isOverdueModalVisible, setIsOverdueModalVisible] = useState(false);
	const [isOverdueModalSeen, setIsOverdueModalSeen] = useState(true);
	const [disabledNotes, setDisabledNotes] = useState('disabled');

	const { data: user, userLoading, userError } = useLoadByIdUser(userId)
    const {data: allGroups, loading, loadAllGroupError} = useLoadAllGroupsRepo();
	const {data: allCourses, coursesLoading, coursesError} = useLoadAllCoursesRepo();
	// const orderedGroups = adminHomePageModel.orderGroups(groupType);
	//
	// useEffect(() => {
	// 	setIsOverdueModalSeen(false);
	// 	if (adminHomePageModel.hasOverdue() && !isOverdueModalSeen) {
	// 		handleOverdueModalShow();
	// 	}
	// }, [usersStore.users]);
	//
	// const handleOverdueModalShow = () => {
	// 	setIsOverdueModalVisible(true);
	// 	setDisabledNotes('');
	// };
	// const handleOverdueCancel = () => {
	// 	setIsOverdueModalVisible(false);
	// 	setIsOverdueModalSeen(true);
	// };

	const handleGroupModals = (e) => {
		if (isModalArchiveVisible || isModalGroupRemoveVisible) {
			e.preventDefault();
		}
	};
	if(loading || coursesLoading || userLoading) {
		return null;
	}

	const adminHomeController = new AdminHomeController(allGroups.groups, allCourses.courses, user);

	if(coursesError) {
		return <p style={{"color": "white"}}>Error: {coursesError.message}</p>
	}
	if(loadAllGroupError) {
		return <p style={{"color": "white"}}>Error: {loadAllGroupError.message}</p>
	}
	return (
		<div className="homeWrapper">
			<div className="homePage-controls">
				<div className="adding-buttons">
					<Link to="/constructor" className="admin-mentor-list">
						<img
							className="icon-add-course home-admin-icon"
							src={iconAddCourse}
							alt="add course"
							title="Создать курс"
						/>
					</Link>
					<Link to="/tests" className="admin-mentor-list">
						<img
							className="icon-add-course home-admin-icon"
							src={iconTest}
							alt="all tests"
							title="Все тесты"
						/>
					</Link>
					{/*<button type="button" onClick={()=> setIsSignUpModalVisible(true)}>*/}
					{/*	<img*/}
					{/*		className="icon-add home-admin-icon"*/}
					{/*		src={iconAddUser}*/}
					{/*		alt="edit"*/}
					{/*		title="Добавить пользователя"*/}
					{/*	/>*/}
					{/*</button>*/}
					<button type="button" onClick={() => setIsCreateGroupModalVisible(true)}>
						<img
							className="icon-add home-admin-icon"
							src={iconAddGroup}
							alt="edit"
							title="Создать группу"
						/>
					</button>
					{/*<button*/}
					{/*	type="button"*/}
					{/*	onClick={handleOverdueModalShow}*/}
					{/*	disabled={disabledNotes}*/}
					{/*	className="admin-notifsBtn-btn"*/}
					{/*>*/}
					{/*	<img*/}
					{/*		className="admin-notifsBtn"*/}
					{/*		src={ImportantNoticeIcon}*/}
					{/*		alt="edit"*/}
					{/*	/>*/}
					{/*</button>*/}
					{/*<Link to="/mentor-list" className="admin-mentor-list">*/}
					{/*	<img*/}
					{/*		className="icon-mentor-list home-admin-icon"*/}
					{/*		src={iconMentorList}*/}
					{/*		alt="mentor list"*/}
					{/*		title="List of mentors"*/}
					{/*	/>*/}
					{/*</Link>*/}
					{/*<Link to="/create-notification">*/}
					{/*	<img*/}
					{/*		src={bell}*/}
					{/*		className="icon-createNotif"*/}
					{/*		alt="alert"*/}
					{/*		title="Create Notification"*/}
					{/*	/>*/}
					{/*</Link>*/}
				</div>
				<div className="logoutbtn-wrapper">
					<LogoutButton />
				</div>
			</div>
			<Divider orientation="center" id='divider'>
				<span
					id='divider-span'
				>
					Группы
				</span>
			</Divider>
			{/*<Modal*/}
			{/*	open={isSignUpModalVisible}*/}
			{/*	onOk={() => setIsSignUpModalVisible(false)}*/}
			{/*	onCancel={() => setIsSignUpModalVisible(false)}*/}
			{/*	footer={null}*/}
			{/*	className="signup-modal"*/}
			{/*>*/}
			{/*	<SignUpForm*/}
			{/*		role={'admin'}*/}
			{/*		setIsSignUpModalVisible={setIsSignUpModalVisible}*/}
			{/*	/>*/}
			{/*</Modal>*/}

			<Modal
				open={isCreateGroupModalVisible}
				onOk={() => setIsCreateGroupModalVisible(false)}
				onCancel={() => setIsCreateGroupModalVisible(false)}
				footer={null}
				className="createGroup-modal"
			>
				<CreateGroupForm />
				{/*<CreateGroupForm setLoadedGroups={groupsStore.setLoaded} />*/}
			</Modal>
			<div className="groups-container">
				<div className="payment-selectContainer">
					<select
						name="group"
						onChange={(e) => setGroupType(e.target.value)}
						className="payment-select"
						value={groupType}
					>
						<option value="" defaultValue>
							Выберите тип групп
						</option>

						{adminHomeController.courses.map((course) => (
							<option key={course.id} value={course.name}>
								{course.name}
							</option>
						))}
					</select>
					<div>
						<img
							className="payment-select-button"
							src={selectCheckmark}
							alt="button"
						/>
					</div>
				</div>
				<div className="homePage-groups">
					{/*{orderedGroups*/}
					{adminHomeController.groups.length
						? adminHomeController.groups.reverse().map((group) => (
								<Link
									to={`/groups/${group.id}`}
									key={group.id}
									onClick={handleGroupModals}
								>
									<GroupItem
										role={'admin'}
										group={group}
										setIsModalGrRemoveVisible={setIsModalGroupRemoveVisible}
										setIsModalArchiveVisible={setIsModalArchiveVisible}
										// adminHomePageModel={adminHomePageModel}
									/>
								</Link>
							))
						:<p className="homePage-groups__text">У вас пока нет групп. Создайте свою первую группу.</p>
					}
				</div>
			</div>
			{/*<Modal*/}
			{/*	open={isOverdueModalVisible}*/}
			{/*	onCancel={handleOverdueCancel}*/}
			{/*	footer={null}*/}
			{/*	className="overdue-modal"*/}
			{/*>*/}
			{/*	<OverdueModal users={adminHomePageModel.tasksUnchecked} />*/}
			{/*</Modal>*/}
		</div>
	);
}

export default HomePage;

