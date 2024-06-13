// страница аккаунта русалки

import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import './MentorsProgress.scss';
import Mentor from '../../components/Mentor/Mentor';
import { Modal } from 'antd';
import iconSalary from '../../assets/controls/icon-salary.png';
import BlocksPrice from '../../components/BlocksPrice/BlocksPrice';
import HomeworkCheckPriceCalculator from "../../../common/template/HomeworkCheckPriceCalculator";

function MentorsProgress({ mentors, frontendBlocks, updateCostOfValidationBlock }) {

	const [isBlocksPriceModalVisible, setIsBlocksPriceModalVisible] =
		useState(false);

	const showBlocksPriceModalForm = () => {
		setIsBlocksPriceModalVisible(true);
	};

	const handleBlocksPriceOk = () => {
		setIsBlocksPriceModalVisible(false);
	};

	const handleBlocksPriceCancel = () => {
		setIsBlocksPriceModalVisible(false);
	};

	const pricesCalc = new HomeworkCheckPriceCalculator(
		new Map(frontendBlocks.map(obj => [obj.id.trim(), Number(obj.homeworkCheckPrice)])),
	);

	return (
		<div className="mentorsWrapper">
			<div className="mentors-title">
				<h1 className="mentors-heading"> Проверенные домашки</h1>
				<button type="button" onClick={showBlocksPriceModalForm}>
					<img className="icon-salary" src={iconSalary} alt="edit" title="Стоимость модулей" />
				</button>
			</div>
			<Modal
				open={isBlocksPriceModalVisible}
				onOk={handleBlocksPriceOk}
				onCancel={handleBlocksPriceCancel}
				footer={null}
				className="blocksPrice-modal"
			>
				<BlocksPrice
					frontendBlocks={frontendBlocks}
					updateCostOfValidationBlock={updateCostOfValidationBlock}
				/>
			</Modal>
			<div>
				{mentors?.map((mentor, i) => {
					return (
						<Mentor
							mentor={mentor}
							key={mentor?.uid}
							pricesCalc={pricesCalc}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default inject(({ mentorsStore, blocksStore }) => {
	const { isLoaded, mentors, loadData } = mentorsStore;
	const { loadCourseFrontendBlocks, frontendBlocks, updateCostOfValidationBlock } = blocksStore;
	useEffect(() => {
		loadData();
		loadCourseFrontendBlocks();
	}, [isLoaded]);

	useEffect(() => {
		mentorsStore.resetCheckedAmountByMonth();
	}, [mentors]);

	return {
		mentors,
		frontendBlocks,
		updateCostOfValidationBlock,
	};
})(observer(MentorsProgress));
