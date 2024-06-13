import React, { useEffect, useState } from 'react';
import './MentorListPage.scss';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import Input from '../../../common/components/Input/Input';
import iconAddUser from '../../assets/controls/icon-add-user.png';
import MagnifierIcon from '../../../common/assets/controls/icon-magnifier.svg';
import Person from '../../../common/components/Person/Person';
import MentorForm from '../../../common/pages/Form/AddMentorForm/MentorForm';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';

function MentorListPage({ mentors, setLoaded, setLoadedGroups }) {
	const [isMentorFormModalVisible, setIsMentorFormModalVisible] =
		useState(false);

	const showMentorModalForm = (value) => {
		setIsMentorFormModalVisible(value);
	};

	return (
		<div className="mentorList__container">
			<header className="mentorList__header">
				<BackArrow pathName={'/groups'} />
				<h1>Менторы</h1>
				<button
					className="mentorList__btn_addMentor"
					onClick={() => showMentorModalForm(true)}
				>
					<img className="icon-add" src={iconAddUser} alt="edit" />
				</button>
			</header>
			<main>
				<section className="searchInput">
					<Input
						className="searchInput-input searchInput-input_admin"
						placeholder="Имя, фамилия"
					/>
					<img
						className="searchInput-icon"
						src={MagnifierIcon}
						alt="magnifier-icon"
					></img>
				</section>
				<section className="mentorList__wrapper">
					<div className="mentorList__mentor-list">
						{mentors.map((mentor) => (
							<div
								className="mentorList__mentor-wrap"
								key={mentor.id}
							>
								<Person
									{...mentor}
									setLoaded={setLoaded}
									setLoadedGroups={setLoadedGroups}
								/>
							</div>
						))}
					</div>
				</section>
			</main>
			<Modal
				open={isMentorFormModalVisible}
				onOk={() => showMentorModalForm(false)}
				onCancel={() => showMentorModalForm(false)}
				footer={null}
				className="signup-modal"
			>
				<MentorForm
					setIsMentorFormModalVisible={setIsMentorFormModalVisible}
					setLoaded={setLoaded}
					mentors={mentors}
				/>
			</Modal>
		</div>
	);
}

export default inject(({ mentorsStore, groupsStore }) => {
	const { isLoaded, mentors, loadData, setLoaded } = mentorsStore;
	const { setLoaded: setLoadedGroups } = groupsStore;

	useEffect(() => {
		loadData();
	}, [isLoaded]);
	return {
		mentors,
		setLoaded,
		setLoadedGroups,
	};
})(observer(MentorListPage));
