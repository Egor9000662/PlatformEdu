import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import './AddStudent.scss';
import { useParams } from 'react-router-dom';
import Button from '../../../common/components/Button/Button';
import selectCheckmark from '../../../common/assets/controls/select_checkmark.svg';

const AddStudent = ({
	groupId,
	handleAddStudentOk,
	course,
	startDate,
	adminGroupModel,
}) => {
	const [student, setStudent] = useState(null);
	const [error, setError] = useState('');

	const studentHandler = (e) => {
		const chosenStudent = adminGroupModel.findUserByName(e.target.value)
		setStudent(chosenStudent)
	};

	async function handleSubmit(e) {
		e.preventDefault();
		console.log('submitted');
		const result = await adminGroupModel.addNewUserToGroup(student, groupId, course, startDate, handleAddStudentOk);
		if (result) {
			setError(result);
			console.log(error);
		}
	}

	return (
		<form className="form-addStudent" onSubmit={handleSubmit}>
			<div className="addStudent-selectContainer">
				<select
					id="user"
					className="addStudent-select addStudent-input"
					onChange={studentHandler}
				>
					<option value="" defaultValue>
						Выбрать студента
					</option>
					{adminGroupModel.users
						.map((user, id) => (
							<option key={id} value={user.name}>
								{user.name} ({user.email})
							</option>
						))}
				</select>
				<img src={selectCheckmark} className="createGroup-checkMark" />
			</div>
			<div className="addStudentButton-modal">
				<Button
					className="addStudent-btn"
					type="submit"
					text="Добавить"
				/>
			</div>
		</form>
	);
};

export default inject(({ usersStore, oneUserStore }) => {
	const groupId = useParams();

	return {
		groupId,
	};
})(observer(AddStudent));
