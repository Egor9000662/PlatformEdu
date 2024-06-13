import {Button, Modal} from "antd";
import React from "react";

function DeleteMentorModal({
   showDeleteMentorModal,
   isVisible,
   deleteMentorFromDB,
   id,
   name,
}) {
	const handleDeleteMentor = async () => {
		await deleteMentorFromDB(id);
		showDeleteMentorModal(false);
	};
	return (
		<Modal
			className="mentorModal mentor-delModal"
			title={`Удалить ментора ${name}`}
			open={isVisible}
			onOk={() => showDeleteMentorModal(false)}
			onCancel={() => showDeleteMentorModal(false)}
			footer={[
				<Button
					key="back"
					className="redBtn"
					onClick={() => showDeleteMentorModal(false)}
				>
					Отмена
				</Button>,
				<Button
					key="submit"
					type="primary"
					className="greenBtn"
					onClick={handleDeleteMentor}
				>
					Ок
				</Button>,
			]}
		>
			<p> Вы уверены?</p>
		</Modal>
	);
}
export default DeleteMentorModal
