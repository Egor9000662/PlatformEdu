import {Button, Modal} from "antd";
import React from "react";

function OpenAccessToCourseModal({ open, onOk, onClick}) {
	return (
		<Modal
			className="stdModal std-removeModal"
			title={`Открыть студенту доступ к курсу`}
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
					Открыть
				</Button>,
			]}
		>
			<span>Вы уверенны?</span>
		</Modal>
	);
}
export default OpenAccessToCourseModal;
