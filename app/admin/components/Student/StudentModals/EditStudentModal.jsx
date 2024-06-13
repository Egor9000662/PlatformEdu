import React, {useState} from "react";
import {inject, observer} from "mobx-react";
import {Button, Modal} from "antd";
import selectCheckmark from "../../../../common/assets/controls/select_checkmark.svg";

function EditStudentModal({
	groupsStore,
	coursesStore,
	oneGroupStore,
	course,
	group,
	isModalMoveVisible,
	setIsModalMoveVisible,
	clearSelect,
	uid,
	lessonNumber,
	setLoadedGroups,
	name,
}) {
	const [selectGroupValue, setSelectGroupValue] = useState(`${group}`);
	const [selectCourseValue, setSelectCourseValue] = useState(`${course}`);
	const [isStdBlocked, setIsStdBlocked] = useState(false);

	const groupsFiltered = groupsStore.groups.filter(
		(group) => group.course === selectCourseValue
	);
	const textInputName = React.createRef();

	const [inputName, setInputName] = useState(
		`${textInputName.defaultValue}`
	);


	async function handleClick() {
		await oneGroupStore.moveUser(
			uid,
			textInputName.current.value,
			selectGroupValue,
			selectCourseValue,
			isStdBlocked,
			lessonNumber
		);
		clearSelect('courseSelect');
		clearSelect('groupSelect');
		setLoadedGroups(false);
		setIsModalMoveVisible(false);
	}

	return (
	<Modal
		className="stdModal std-moveModal"
		title="Настроить студента"
		open={isModalMoveVisible}
		onOk={() => setIsModalMoveVisible(false)}
		onCancel={() => setIsModalMoveVisible(false)}
		footer={[
			<Button
				key="back"
				onClick={() => setIsModalMoveVisible(false)}
				className="redBtn"
			>
				Отмена
			</Button>,
			<Button
				key="submit"
				type="primary"
				onClick={handleClick}
				className="greenBtn"
			>
				Ок
			</Button>,
		]}
	>
		<div className="stdMove-renameContainer">
			<label htmlFor="stdName">
				<p className="stdMove-heading">
					Переименовать
				</p>
			</label>
			<input
				ref={textInputName}
				id="stdName"
				type="text"
				className="stdMove-input"
				defaultValue={name}
				onChange={(e) => setInputName(e.target.defaultValue)}
				placeholder="Имя"
			/>
		</div>
		<div className="stdMove-moveSelects">
			<p className="stdMove-heading">
				Переместить студента
			</p>
			<div className="stdMove-selectContainer">
				<select
					name="course"
					id="courseSelect"
					className="stdMove-select"
					onChange={(e) => setSelectCourseValue(e.target.value)}
				>
					<option value="0" defaultValue>
						Выберите курс
					</option>
					{coursesStore.courses
						.filter((course) => course.id !== 'course-unassigned')
						.map((courseInfo) => {
							return (
								<option
									key={courseInfo.id}
									value={courseInfo.id}
								>
									{courseInfo.id}
								</option>
							);
						})}{' '}
				</select>
				<img
					src={selectCheckmark}
					className="stdMove-checkMark"
					alt="checkMark"
				/>
			</div>
			<div className="stdMove-selectContainer">
				<select
					name="group"
					id="groupSelect"
					onChange={(e) => setSelectGroupValue(e.target.value)}
					className="stdMove-select"
				>
					<option value="0" defaultValue>
						Выберите группу
					</option>
					{groupsFiltered.map((groupInfo) => {
						return (
							<option
								key={groupInfo.id}
								value={groupInfo.id}
							>
								{groupInfo.id}
							</option>
						);
					})}{' '}
				</select>
				<img
					src={selectCheckmark}
					className="stdMove-checkMark"
					alt="checkMark"
				/>
			</div>
		</div>
		<div className="stdMove-blockContainer">
			<p className="stdMove-heading">
				Заблокировать доступ студента?
			</p>
			<div className="stdMove-radioBtns">
				<span>
					<input
						type="radio"
						id="block-true"
						name="block"
						value={true}
						onChange={(e) => setIsStdBlocked(e.target.value)}
					/>
					<label htmlFor="block-true">Да</label>
				</span>
				<span>
					<input
						type="radio"
						id="block-false"
						name="block"
						value={false}
						onChange={(e) => setIsStdBlocked(e.target.value)}
					/>
					<label htmlFor="block-false">Нет</label>
				</span>
			</div>
		</div>
	</Modal>
	)
}
export default inject(
	({  groupsStore, coursesStore, oneGroupStore }) => {
		return {
			groupsStore,
			coursesStore,
			oneGroupStore,
		};
	}
)(observer(EditStudentModal));
