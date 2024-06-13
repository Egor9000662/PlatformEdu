import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { v4 as uuidv4 } from 'uuid';

import selectCheckmark from '../../../common/assets/controls/select_checkmark.svg';

import './ChooseBlocksModal.scss';

function ChooseBlocksModal({
	modules,
	setChosenModules,
	visible,
	handleEditVisible,
	mentorId,
	setPriorityModule,
}) {
	const [chosenBlocks, setChosenBlocks] = useState([]);
	const [priorityBlock, setPriorityBlock] = useState(null);

	const handleChange = (value) => {
		setChosenBlocks(value);
	};

	const handleChoosePriority = (priorityBlock) => {
		setPriorityBlock(priorityBlock);
	};

	function handleOkChooseBlock() {
		let objBlocks = chosenBlocks.reduce((acc, cur, i) => {
			acc[cur] = { name: cur, priority: false };
			return acc;
		}, {});
		setChosenModules(objBlocks);

		if (priorityBlock) {
			setPriorityModule(mentorId, priorityBlock);
		}
		handleEditVisible(false);
	}

	function handleCancelChooseBlock() {
		handleEditVisible(false);
	}

	return (
		<>
			<Modal
				className="blockModal block-ChooseModal"
				title="выберите модули для проверки"
				open={visible}
				onCancel={handleCancelChooseBlock}
				footer={[
					<Button
						key="back"
						onClick={handleCancelChooseBlock}
						className="redBtn"
					>
						Отмена
					</Button>,
					<Button
						key="submit"
						type="primary"
						onClick={handleOkChooseBlock}
						className="greenBtn"
					>
						Ок
					</Button>,
				]}
			>
				<div className="stdMove-selectContainer">
					<Select
						mode="multiple"
						placeholder="Выберите модуль"
						onChange={handleChange}
						value={[...new Set(['HTML CSS', ...chosenBlocks])]}
					>
						{modules?.map((module) => {
							return (
								<Select.Option key={uuidv4()} value={module} disabled={module === 'HTML CSS'}>
									{module}
								</Select.Option>
							);
						})}
					</Select>
					<img
						src={selectCheckmark}
						className="blockChoose-checkMark"
					/>
					{chosenBlocks.length ? (
						<>
							<Select
								placeholder="Выбери приоритетный модуль"
								onChange={handleChoosePriority}
								className="selection-priority-block"
							>
								{chosenBlocks?.map((module, i) => {
									return (
										<Select.Option key={i} value={module}>
											{module}
										</Select.Option>
									);
								})}
							</Select>

							<img
								src={selectCheckmark}
								className="blockChoose-checkMark__priority"
							/>
						</>
					) : (
						''
					)}
				</div>
			</Modal>
		</>
	);
}

export default inject(({ oneMentorStore }) => {
	const { setPriorityModule } = oneMentorStore;

	return {
		setPriorityModule,
	};
})(observer(ChooseBlocksModal));
