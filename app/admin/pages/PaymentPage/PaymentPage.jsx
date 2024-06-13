import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Modal, DatePicker, Space } from 'antd';
import './PaymentPage.scss';
import SettingsPic from '../../../common/assets/controls/all_settings_icon.svg';
import PaymentInfo from '../../components/PaymentInfo/PaymentInfo';
import selectCheckmark from '../../../common/assets/controls/select_checkmark.svg';
import AdminPaymentModel from '../../models/AdminPaymentModel';

function PaymentPage({ adminPaymentModel }) {
	const [chosenGroup, setChosenGroup] = useState('');
	const [debtors, setDebtors] = useState([]);
	const [beneficiaries, setBeneficiaries] = useState([]);
	const [paymentGroupDate, setPaymentGroupDate] = useState('');
	const [newPaymentGroupDate, setNewPaymentGroupDate] = useState('');
	const [isModalPaymentSettings, setIsModalPaymentSettings] = useState(false);

	useEffect(() => {
		setDebtors(adminPaymentModel.debtors);
		setBeneficiaries(adminPaymentModel.beneficiaries);
		setPaymentGroupDate(adminPaymentModel.paymentDate);
	}, [chosenGroup]);

	const handleChosenGroup = (e) => {
		adminPaymentModel.groupId = e.target.value;
		setChosenGroup(e.target.value);
	};

	const handleDeleteDebtor = async (uid, months) => {
		const newDebtors = await adminPaymentModel.removeUserFromDebtors(uid, months);
		setDebtors(newDebtors);
	};

	const handleDeleteBeneficiary = async (uid) => {
		const newBeneficiaries = await adminPaymentModel.removeBeneficiaryStatus(uid);
		setBeneficiaries(newBeneficiaries);
	};

	const getDebtorSinceDate = (monthsInDebt) => {
		return adminPaymentModel.getDebtorSinceDate(paymentGroupDate, monthsInDebt);
	}

	function handleOkPaymentSettings() {
		adminPaymentModel.updateGroupPaymentDate(newPaymentGroupDate);
		setIsModalPaymentSettings(false);
	}

	function handleEditPaymentGroupDate(data, dateString) {
		setNewPaymentGroupDate(dateString);
	}

	return (
		<div className="paymentWrapper">
			<div className="payment-header">
				<div className="payment-header__title">
					<h1>Оплата услуг</h1>
				</div>
				<div className="payment-header__settings">
					<button type="button" onClick={() => setIsModalPaymentSettings(true)}>
						<img src={SettingsPic} alt="settings" />
					</button>
					<Modal
						className="paymentSettingsModal"
						title="Изменить текущую даты оплаты"
						open={isModalPaymentSettings}
						onCancel={() => setIsModalPaymentSettings(false)}
						footer={[
							<Button
								key="back"
								onClick={() => setIsModalPaymentSettings(false)}
								className="redBtn"
							>
								Отмена
							</Button>,
							<Button
								key="submit"
								type="primary"
								onClick={handleOkPaymentSettings}
								className="greenBtn"
							>
								Ок
							</Button>,
						]}
					>
						<div className="paymentSettings-selectContainer">
							<select
								name="group"
								onChange={handleChosenGroup}
								className="paymentSettings-select paymentSettings-input"
								value={chosenGroup}
							>
								<option value="" defaultValue>
									Выберите группу
								</option>
								{adminPaymentModel.filteredGroups
									.map((groupInfo) => {
										return (
											<option
												key={groupInfo.id}
												value={groupInfo.id}
											>
												{groupInfo.id}
											</option>
										);
									})}
							</select>
							<img
								className="paymentSettings-checkMark"
								src={selectCheckmark}
								alt="button"
							/>
						</div>
						<Space direction="vertical">
							<DatePicker
								placeholder={paymentGroupDate || 'Дата оплаты'}
								className="paymentSettings-input"
								format={'DD.MM.YYYY'}
								disabled
							/>
						</Space>
						<Space direction="vertical">
							<DatePicker
								placeholder={
									newPaymentGroupDate || 'Новая дата'
								}
								format={'DD.MM.YYYY'}
								onChange={handleEditPaymentGroupDate}
								className="paymentSettings-input"
							/>
						</Space>
					</Modal>
				</div>
			</div>
			<div className="payment-selectContainer">
				<select
					name="group"
					onChange={handleChosenGroup}
					className="payment-select"
					value={chosenGroup}
				>
					<option value="" defaultValue>
						Выберите группу
					</option>
					{adminPaymentModel.filteredGroups
						.map((groupInfo) => {
							return (
								<option key={groupInfo.id} value={groupInfo.id}>
									{groupInfo.id}
								</option>
							);
						})}
				</select>
				<div>
					<img
						className="payment-select-button"
						src={selectCheckmark}
						alt="button"
					/>
				</div>
			</div>
			<div className="payment-main">
				<div className="payment-main__debtors-block">
					<h3>Ожидается оплата</h3>
					<div className="payment-studentList">
						{debtors?.map((student) => {
							return (
								<PaymentInfo
									{...student}
									key={student.name}
									deleteDebtor={handleDeleteDebtor}
									type={'debtor'}
									getDebtorSinceDate={getDebtorSinceDate}
								/>
							);
						})}
					</div>
				</div>
				<div className="payment-main__beneficiary-block">
					<h3>Студенты с особенностями оплаты</h3>
					<div className="payment-studentList">
						{beneficiaries?.map((student) => {
							return (
								<PaymentInfo
									{...student}
									key={student.name}
									type={'beneficiary'}
									deleteBeneficiary={handleDeleteBeneficiary}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default inject(
	({ usersStore, groupsStore }) => {
		const adminPaymentModel = new AdminPaymentModel(usersStore, groupsStore);

		useEffect(() => {
			usersStore.loadData();
			groupsStore.loadData();
		}, [usersStore.isLoaded]);

		useEffect(() => {
			adminPaymentModel.setPaymentDateForGroups();
		}, [groupsStore.groups]);

		useEffect(() => {
			adminPaymentModel.setDebtors();
		}, [usersStore.users]);

		return {
			adminPaymentModel,
		};
	}
)(observer(PaymentPage));
