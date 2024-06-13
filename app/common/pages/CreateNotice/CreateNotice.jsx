import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Radio } from 'antd';
import BackArrow from '../../components/BackArrow/BackArrow';
import { v4 as uuidv4 } from 'uuid';
import GroupsMultiselect from "./GroupsMultiselect";
import CoursesMultiselect from "./CoursesMultiselect";
import UrgentNoticeSender from "../../models/UrgentNoticeSender";
import './CreateNotice.scss';

function CreateNotice({
	role,
	groupsStore,
	urgentNoticeSender,
	oneMentorStore,
	coursesStore,
}) {
	const [notifsData, setNotifsData] = useState({
		recipients: [],
		event: '',
		message: '',
		courses: [],
	});
	const [errors, setErrors] = useState([]);
	const [showMessage, setShowMessage] = useState(false);

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setNotifsData({
			...notifsData,
			[name]: value,
		});
	};

	const handleRecipients = (value) => {
		setNotifsData({ ...notifsData, recipients: value });
	};
	const handleCourse = (value) => {
		setNotifsData({ ...notifsData, courses: value });
	};

	const notifsThemes = urgentNoticeSender.getNotifsThemes(role);

	const handleValidate = () => {
		const errors = urgentNoticeSender.validateNotifsData(notifsData);
		if (errors.length !== 0) {
			setErrors(errors);
			return false;
		} else {
			return true;
		}
	}

	const submitNotice = () => {
		if (handleValidate()) {
			urgentNoticeSender.send(notifsData, role);
			setNotifsData({
				recipients: [],
				event: '',
				message: '',
				courses: [],
			});
			setErrors([]);
			setShowMessage(true);
			setTimeout(() => setShowMessage(false), 3000);
		}
	};

	const store = role === 'teacher' ? oneMentorStore : coursesStore;
	if (!groupsStore.isLoaded || !store.isLoaded) {
		return null;
	}

	const groupRecipients = role === 'teacher' ? Object.keys(oneMentorStore.groups) :
		urgentNoticeSender.getCourseGroups(notifsData.courses);

	return (
		<div className="createNotice-container">
			<form className="createNotice-form">
				<div className="createNotice-header">
					<div className="createNotice-header__btn">
						<BackArrow pathName={'/groups'} />
					</div>
					<h1 className="createNotice-title">Создать уведомление</h1>
				</div>
				<div className="createNotice-selectContainer">
					{role === 'admin' && (
						<CoursesMultiselect
							courses={coursesStore.courses}
							currentCourses={notifsData.courses}
							handleCourse={handleCourse}
						/>
					)}
					<GroupsMultiselect
						recipients={groupRecipients}
						currentRecipients={notifsData.recipients}
						handleRecipients={handleRecipients}
					/>
				</div>
				<div className="createNotice-radioGroup">
					<Radio.Group
						name="event"
						value={notifsData.event}
						onChange={handleChange}
					>
						<div>
							<Form.Item>
								{notifsThemes
									.map((theme) => (
										<Radio
											value={theme.name}
											className="createNotice-radioOne"
											key={uuidv4()}
										>
											{theme.name}
										</Radio>
									))}
							</Form.Item>
						</div>
					</Radio.Group>
				</div>
				<div className="createNotice-textareaContainer">
					<textarea
						className="createNotice-textarea"
						placeholder="Ваше сообщение"
						name="message"
						value={notifsData.message}
						onChange={handleChange}
					/>
				</div>
				{errors.length !== 0 && (
					<div className="createNotice-errorsOutput">
						{`Заполните пустые поля: ${errors.join(', ')}!`}
					</div>
				)}
				{showMessage && (
					<p className="createNotice-successOutput">
						Уведомление успешно отправлено!
					</p>
				)}
				<div className="createNotice-controls">
					<button
						className="createNotice-btn"
						type="button"
						onClick={submitNotice}
					>
						Создать
					</button>
				</div>
			</form>
		</div>
	);
}

export default inject(({
	auth,
	groupsStore,
	mentorsStore,
	oneUserStore,
	oneMentorStore,
	coursesStore,
}) => {
	const { uid } = auth.user;
	const urgentNoticeSender = new UrgentNoticeSender(
		groupsStore,
		oneUserStore,
	);
	useEffect(() => {
		mentorsStore.loadData();
	}, [mentorsStore.isLoaded]
	);

	const currentMentor = mentorsStore.mentors?.find(
		(mentor) => mentor.uid === uid
	);
	oneMentorStore.id = currentMentor?.id;

	useEffect(() => {
		oneMentorStore.loadData()
	}, [oneMentorStore.isLoaded]);

	useEffect(() => {
		coursesStore.loadDataCourse();
	}, [coursesStore.isLoaded]);

	useEffect(() => {
		urgentNoticeSender.loadData();
	}, [urgentNoticeSender.isLoaded])

	return {
		groupsStore,
		urgentNoticeSender,
		oneMentorStore,
		coursesStore,
	};
})(observer(CreateNotice));
