import {Button, Modal} from "antd";
import React from "react";

function BenefitsModal({name, open, onOk, onCancel, onClick, onClick1}) {
	return (
		<Modal
			className="stdModal std-removeModal"
			title={`Привилегии для ${name}`}
			open={open}
			onOk={onOk}
			onCancel={onCancel}
			footer={[
				<Button
					key="back"
					onClick={onClick}
					className="redBtn"
				>
					Нет
				</Button>,
				<Button
					key="submit"
					type="primary"
					onClick={onClick1}
					className="greenBtn"
				>
					Да
				</Button>,
			]}
		>
			<span>У студента есть особенности оплаты?</span>
		</Modal>
	)
}
export default BenefitsModal;
