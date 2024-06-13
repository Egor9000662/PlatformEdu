import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {Modal} from 'antd';
import AddStudent from '../../components/AddStudent/AddStudent';
import Group from '../../../common/components/Group/Group';
import StudentsList from '../../components/StudentsList/StudentsList';
import './GroupPage.scss';
import iconAddUser from '../../assets/controls/icon-add-user.png';
import iconSend from '../../../common/assets/controls/chat/send-button.svg';

import bell from '../../assets/controls/bell.svg';
import AdminGroupModel from '../../models/AdminGroupModel';
import {useLoadGroupRepo} from "../../../common/repositories/GroupRepository";
import RegistrationLink from "../../../common/AppLogic/admin/RegistrationLink";

function GroupPage() {
	const {id: groupId} = useParams();
	const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);
	const [isTextarea, setIsTextarea] = useState(false);
	const [emails, setEmails] = useState('');
	const [sentError, setSentError] = useState(false);
	const [unsentMessagesEmails, setUnsentMessagesEmails] = useState([])


	const {data, groupLoading, loadGroupError} = useLoadGroupRepo(groupId);


	if (groupLoading) {
		return null;
	}
	if (loadGroupError) {
		return <p style={{"color": "white"}}>Error: {loadGroupError.message}</p>
	}
	const registrationLink = new RegistrationLink(data.group);

	async function sendMessage() {
		if(!emails.length) return;
		const {failedEmails} = await registrationLink.sendPersonalLink(emails);
		if(failedEmails.length > 0) {
			setSentError(true);
			setUnsentMessagesEmails(failedEmails);
		} else {
			setEmails('');
		}
	}

	return (
		<div className="groupPageWrapper-admin">
			<Group
				key={data.group.id}
				group={data.group}
				registrationLink={registrationLink}
				// currentLesson={currentLesson}
			/>
			<div className="groupPageWrapper-students">
				<div className="groupPageWrapper__icon-container">
					<button
						type="button"
						onClick={() => setIsAddStudentModalVisible(true)}
						className="addStudent-button"
					>
						<img className="group-add-icon" src={iconAddUser} alt="edit"/>
					</button>
					<button
						type="button"
						className="group-send-button"
						title="Send Link"
						onClick={() => setIsTextarea(true)}
					>
						<img className="group-send-icon" src={iconSend} alt="send"/>
					</button>
				</div>
				{isTextarea &&
					<div className="groupPageWrapper__emails-container">
						<button
							className="groupPageWrapper__button-close"
							type="button"
							title="Close"
							onClick={() => setIsTextarea(false)}
						>
							&#10006;
						</button>
						<div className="groupPageWrapper__textarea-container">
							<textarea
								className='groupPageWrapper__textarea'
								placeholder="Введите почту..."
								onChange={(event) => setEmails(event.target.value)}
								value={emails}
							></textarea>
						</div>
						<button
							className="groupPageWrapper__button-send"
							onClick={sendMessage}
						>
							Отправить
						</button>
					</div>
				}

				{/*<StudentsList />*/}
				<div className="groupPage__buttonAndBell">
					{/*	<Link to={`/evaluation/${group.id}`}>*/}
					{/*		<div className="groupPage__group-button">*/}
					{/*			Успеваемость*/}
					{/*		</div>*/}
					{/*	</Link>*/}
					{/*<Link to={`/create-notification/${group.id}`}>*/}
					{/*	<div className="groupPage__bell">*/}
					{/*		<img src={bell} alt="alert" />*/}
					{/*	</div>*/}
					{/*</Link>*/}
				</div>
			</div>

			<Modal
				open={isAddStudentModalVisible}
				onOk={() => setIsAddStudentModalVisible(false)}
				onCancel={() => setIsAddStudentModalVisible(false)}
				footer={null}
				className="addStudent-modal"
			>
				<AddStudent
					// course={course}
					// startDate={group?.startDate}
					handleAddStudentOk={() => setIsAddStudentModalVisible(false)}
					// setLoadedGroups={setLoadedGroups}
					// adminGroupModel={adminGroupModel}
				/>
			</Modal>
			<Modal
				open={sentError}
				onOk={() => setSentError(false)}
				onCancel={() => setSentError(false)}
				footer={null}
				className="addStudent-modal"
			>
				<p>Ой, что-то пошло не так...<br/>
					Похоже произошла ошибка и на эти email не отпавилось письмо с ссылкой: {unsentMessagesEmails?.join(', ')}.<br/>
					Проверьте соединение с интернетом и попробуйте еще раз.
				</p>
			</Modal>
		</div>
	);
}

export default GroupPage;
