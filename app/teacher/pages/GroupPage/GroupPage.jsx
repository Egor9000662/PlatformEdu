import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import StudentsList from '../../components/StudentsList/StudentsList';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import bell from '../../assets/controls/bell.svg';
import './GroupPage.scss';

function GroupPage({ group }) {

	if (!group.isLoaded) {
		return null;
	}
	return (
		<div className="groupPageWrapper">
			<div className="header-container">
				<div className="header-container__btn">
					<BackArrow pathName={'/groups'} />
				</div>
				<h1 className="groupPage-title">{group.id}</h1>
			</div>
			<StudentsList
				className="groupPage-studentList"
			/>
			<div className="groupPage__buttonAndBell">
				<Link to={`/evaluation/${group.id}`}>
					<div className="groupPage__group-button">Успеваемость</div>
				</Link>
			</div>
		</div>
	);
}

export default inject(({ groupsStore, lessonsStore }) => {
	const { id } = useParams();
	const group = groupsStore.getGroup(id);

	useEffect(() => {
		group.loadData();
	}, [id]);

	useEffect(() => {
		group.getStudents();
	}, [group.id]);

	return {
		group,
	};
})(observer(GroupPage));
