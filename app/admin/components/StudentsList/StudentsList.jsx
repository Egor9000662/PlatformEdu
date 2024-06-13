import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import {useParams} from 'react-router-dom';
import Student from '../Student/Student';
import MagnifierIcon from '../../../common/assets/controls/icon-magnifier.svg';
import './StudentsList.scss';
import Input from '../../../common/components/Input/Input';
import getStudents from "./getStudents";

function StudentsList({ group, setLoadedGroups }) {
	const [searchName, setSearchName] = useState('');

    const students = getStudents(group, searchName);

	return (
		<>
			<div className="searchInput">
				<Input
					className="searchInput-input searchInput-input_admin"
					placeholder="Почта, имя, фамилия"
					onChange={(event) => {
						setSearchName(event.target.value);
					}}
				/>
				<img
					className="searchInput-icon"
					src={MagnifierIcon}
					alt="magnifier-icon"
				></img>
			</div>
			<div className="studentsListWrapper">
				<div className="students-admin-list">
					{students.map((student) => (
						<div className="studentWrap" key={student.uid}>
								<Student
									{...student}
									{...group?.lesson}
									setLoadedGroups={setLoadedGroups}
								/>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default inject(({ groupsStore }) => {
	const { id: groupId } = useParams();
	const { getGroup, isLoaded, setLoaded: setLoadedGroups } = groupsStore;

	const group = getGroup(groupId);
	useEffect(() => {
		group.getStudents();
	}, [isLoaded, group]);

	return {
		group,
		setLoadedGroups,
	};
})(observer(StudentsList));
