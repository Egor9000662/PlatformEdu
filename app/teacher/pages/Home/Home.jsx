import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal } from 'antd';
import './Home.scss';
import LogoutButton from '../../../common/components/LogoutButton/LogoutButton';
import bell from '../../assets/controls/bell.svg';
import selectButton from '../../../common/assets/controls/select_checkmark.svg';
import OverdueModal from '../../../common/components/OverdueModal/OverdueModal';
import iconSalary from "../../../admin/assets/controls/icon-salary.png";
import HomeworkCheckPriceCalculator from "../../../common/template/HomeworkCheckPriceCalculator";
import BlockPrice from "../../components/BlockPrice/BlockPrice";
import MentorHomePage from "../../Models/MentorHomePage";
import GroupItem from "../../../common/components/GroupItem/GroupItem";

function HomePage({
	groupsStore,
	coursesStore,
	blocksStore,
	mentorHomePage,
	usersStore,
	role,
}) {
	const [isOverdueModalVisible, setIsOverdueModalVisible] = useState(false);
	const [courseType, setCourseType] = useState(undefined);
	const [isBlocksPriceModalVisible, setIsBlocksPriceModalVisible] = useState(false);

	useEffect(() => {
		mentorHomePage.getOverdueStudents(setIsOverdueModalVisible)
	}, [mentorHomePage.mentor.uid]);

	const groupsFiltered = mentorHomePage.filterGroups(courseType);
	const filterOptions = mentorHomePage.getFilterOptions();

	const handleOverdueCancel = () => {
		setIsOverdueModalVisible(false);
		usersStore.clearTasksUnchecked();
	};

	const handleGroupType = (e) => {
		setCourseType(e.target.value);
	};

	const pricesCalc = new HomeworkCheckPriceCalculator(
		new Map(blocksStore.frontendBlocks.map(obj => [obj.id.trim(), Number(obj.homeworkCheckPrice)])),
	);

	if (!groupsStore.isLoaded && !coursesStore.isLoaded) {
		return null;
	}
	return (
		<div className="homeWrapper">
			<div className="headerContainer">
				<h1 className="homeHeader-title"> Группы</h1>
				<div className="homeHeader-logout-btn">
					<LogoutButton />
				</div>
			</div>
			<div className="select-container">
				<select
					id="courses"
					name="group"
					onChange={handleGroupType}
					className="select-teacher-groups"
					value={courseType}
				>
					{filterOptions.map((option) => (
						<option
							value={option.value}
							defaultValue={option.isDefault ? true : null}
							key={option.name}
						>
							{option.name}
						</option>
					))}
				</select>
				<div>
					<img
						className="select-button"
						src={selectButton}
						alt="button"
					/>
				</div>
			</div>
			<div className="homeCounter__groups">
				{(groupsFiltered.length ? groupsFiltered : mentorHomePage.groups)
					.map((group) => {
						return (
							<div className="homeCounter__group" key={group.id}>
								<Link to={`/groups/${group.id}`}>
									<GroupItem
										role={role}
										group={group}
										usersStore={usersStore}
									/>
								</Link>
							</div>
						);
					})
				}
			</div>
			<div className="teacherHome-controls">
				<div>
					<Link to="/group-meeting">
						<div className="group-button meetingsBtn">Созвоны</div>
					</Link>
				</div>
				<div>
					<Link to="/messenger">
						<div className="group-button messengerBtn">
							Мессенджер
						</div>
					</Link>
				</div>
				<div>
					<Link to="/create-notification">
						<div className="bell">
							<img src={bell} alt="alert" />
						</div>
					</Link>
				</div>
				<button type="button" onClick={() => setIsBlocksPriceModalVisible(true)}>
					<img className="icon-salary" src={iconSalary} alt="edit" />
				</button>
			</div>
			<Modal
				open={isBlocksPriceModalVisible}
				onOk={() => setIsBlocksPriceModalVisible(false)}
				onCancel={() => setIsBlocksPriceModalVisible(false)}
				footer={null}
				className="createGroup-modal"
			>
				<BlockPrice
					mentor={mentorHomePage.mentor}
					key={mentorHomePage.mentor?.uid}
					pricesCalc={pricesCalc}
				/>
			</Modal>
			<Modal
				open={isOverdueModalVisible}
				onCancel={handleOverdueCancel}
				footer={null}
				className="overdue-modal"
			>
				<OverdueModal users={mentorHomePage.uncheckedTasks} />
			</Modal>
		</div>
	);
}

export default inject(
	({ groupsStore, coursesStore, usersStore, auth, mentorsStore, blocksStore }) => {
		const { uid } = auth.user;
		const { role } = auth;

		useEffect(() => {
			coursesStore.loadDataCourse();
			usersStore.loadData();
			mentorsStore.loadData();
		}, []);
		useEffect(() => {
			groupsStore.loadData();
		}, [groupsStore.isLoaded]);
		useEffect(() => {
			blocksStore.loadCourseFrontendBlocks();
		}, [blocksStore.isLoaded]);

		useEffect(() => {
			for (let user of usersStore.users) {
				for (let group of user.groups) {
					usersStore.getSentTasksInfo(user.uid, user.name, group.groupId, group.course);
				}
				usersStore.checkLongOverdue(user.uid);
			}
		}, [usersStore.users]);

		const oneMentor = mentorsStore.getMentor(uid);

		const mentorHomePage = new MentorHomePage(oneMentor, usersStore, groupsStore);

		return {
			groupsStore,
			coursesStore,
			blocksStore,
			mentorHomePage,
			usersStore,
			role,
		};
	}
)(observer(HomePage));
