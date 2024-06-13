import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import RedCross from '../../../common/assets/controls/red_cross.svg';
import './PaymentInfo.scss';
import { Button, Modal } from 'antd';

function PaymentInfo(props) {
	const {
		uid,
		name,
		group,
		course,
		debtor,
		monthsInDebt,
		deleteDebtor,
		deleteBeneficiary,
		type,
		getDebtorSinceDate,
	} = props;
	const [monthsAmount, setMonthsAmount] = useState(monthsInDebt);
	const [debtorSince, setDebtorSince] = useState('');
	const [modalStdPaymentVisible, setModalStdPaymentVisible] = useState(false);

	useEffect(() => {
		setDebtorSince(getDebtorSinceDate(monthsAmount));
	}, [monthsAmount]);

	const showModalStdPaymentVisible = () => {
		setModalStdPaymentVisible(true);
	};

	const handleOkStdStatus = () => {
		setModalStdPaymentVisible(false);
	};

	const handleCancelStdStatus = () => {
		setModalStdPaymentVisible(false);
	};

	const handleDeleteDebtor = async () => {
		deleteDebtor(uid, monthsAmount);
		setMonthsAmount((prev) => prev - 1);
		setModalStdPaymentVisible(false);
	};

	const handleDeleteBeneficiary = async () => {
		deleteBeneficiary(uid);
		setModalStdPaymentVisible(false);
	};

	const text =
		type === 'debtor'
			? 'Оплата получена?'
			: 'Удалить из льготной категории?';

	return (
		<div className="paymentInfoWrapper">
			<div className="payment-info__block">
				<div
					className={
						debtor && type === 'beneficiary'
							? 'payment-info__studentInfo beneficiary-debt'
							: 'payment-info__studentInfo'
					}
				>
					<p className="studentInfo__name">{name}</p>
					<p className="studentInfo__courseInfo">
						{course} - {group}
					</p>
				</div>
				{debtor && type === 'debtor' && (
					<span className="payment-info__date">с {debtorSince}</span>
				)}

				<div className="payment-info__controls">
					<button onClick={showModalStdPaymentVisible}>
						<img src={RedCross} />
					</button>
				</div>
				<Modal
					className="stdModal std-removeModal"
					title={` ${name}`}
					open={modalStdPaymentVisible}
					onOk={handleOkStdStatus}
					onCancel={handleCancelStdStatus}
					footer={[
						<Button
							key="back"
							onClick={handleCancelStdStatus}
							className="redBtn"
						>
							Нет
						</Button>,
						<Button
							key="submit"
							type="submit"
							onClick={
								type === 'debtor'
									? handleDeleteDebtor
									: handleDeleteBeneficiary
							}
							className="greenBtn"
						>
							Да
						</Button>,
					]}
				>
					<span>{text}</span>
				</Modal>
			</div>
		</div>
	);
}
export default inject(({ }) => {
})(observer(PaymentInfo));
