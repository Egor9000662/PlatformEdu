import {Button, Modal} from "antd";
import React from "react";

function DeleteStudentModal({name, open, onOk, onClick}) {
	return (
		<Modal
			className="stdModal std-removeModal"
			title={`Удалить студента ${name}`}
			open={open}
			onOk={onOk}
			onCancel={onOk}
			footer={[
				<Button
					key="back"
					onClick={onOk}
					className="redBtn"
				>
					Упс, нет
				</Button>,
				<Button
					key="submit"
					type="primary"
					onClick={onClick}
					className="greenBtn"
				>
					Удаляем
				</Button>,
			]}
		>
			<span>Хорошо подумали?</span>
		</Modal>
	);
}
export default DeleteStudentModal;
