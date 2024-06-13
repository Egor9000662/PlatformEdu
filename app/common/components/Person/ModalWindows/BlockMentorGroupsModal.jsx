import { Button, Select } from "antd";
import selectCheckmark from "../../../assets/controls/select_checkmark.svg";
import React, { useState, useEffect } from "react";
import './BlockMentorGroupModal.scss'
import { inject, observer } from "mobx-react";

function BlockMentorGroupsModal({
	id,
	setIsBlockedGroupsModalVisible,
	groups,
	oneMentorStore,
	blockedGroups,
}) {

	const [chosenGroups, setChosenGroups] =
		useState();

	useEffect(() => {
		setChosenGroups(Object.values(blockedGroups));
	}, []);

	const handleChosenGroups = (event) => {
		setChosenGroups(event);
	}

	const handleBlockMentorGroups = () => {
		setIsBlockedGroupsModalVisible(false);
		oneMentorStore.setBlockedGroups(id, chosenGroups);
	}

	return (
		<>
			<div className="addMentor-selectContainer">
				<Select
					mode="multiple"
					// id="group"
					onChange={handleChosenGroups}
					placeholder="Выбрать группы"
					value={chosenGroups}
				>

					{groups
						.filter((group) => !group.archived)
						.map((group) =>
							<Select.Option key={group.id} value={group.id}>
								{group.id}
							</Select.Option>
						)}

				</Select>
				<img src={selectCheckmark} className="addMentor-checkMark" alt={selectCheckmark} />
			</div>
			<Button
				className="block-button signup-button"
				type="submit"
				onClick={handleBlockMentorGroups}
			>Заблокировать</Button>
		</>
	)
}
export default inject(({ groupsStore, oneMentorStore }) => {
	return {
		groupsStore,
		oneMentorStore,
	};
})(observer(BlockMentorGroupsModal));
