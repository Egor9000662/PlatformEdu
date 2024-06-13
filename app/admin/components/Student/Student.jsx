import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import './Student.scss';
import starDefault from '../../../common/assets/stars/StarDefault.svg';
import starYellow from '../../../common/assets/stars/StarYellow.svg';
import iconEdit from '../../../common/assets/controls/icon-edit.svg';
import iconDelete from '../../../common/assets/controls/icon-delete.svg';
import iconInfo from '../../../common/assets/controls/icon-info.svg';
import FrontendAvatar from '../../../common/assets/defaultAvatars/frontend-avatar.png';
import IntroInfoModal from './StudentModals/IntroInfoModal';
import BenefitsModal from "./StudentModals/BenefitsModal";
import DeleteStudentModal from "./StudentModals/DeleteStudentModal";
import EditStudentModal from "./StudentModals/EditStudentModal";
import {Link} from "react-router-dom";
import OpenAccessToCourseModal from "./StudentModals/OpenAccessToCourseModal";

function SvgBackgrounds() {
	return (
		<>
			<svg className="svgs">
				<clipPath id="window-1">
					<path d="M0 335.5V43.5655C0 40.879 2.91617 39.207 5.23458 40.5641L7.74277 42.0324C15.7589 46.7247 25.5351 47.3029 34.0484 43.588C42.5222 39.8903 48 31.5234 48 22.278V13.6569C48 6.11441 54.1144 0 61.6569 0H402.5C413.546 0 422.5 8.95431 422.5 20V335.5C422.5 346.546 413.546 355.5 402.5 355.5H20C8.95431 355.5 0 346.546 0 335.5Z" />
				</clipPath>
			</svg>
			<svg className="svgs">
				<clipPath id="window-2">
					<path d="M 0 381 V 49.0058 C 0 46.0494 3.221 44.2196 5.7604 45.7333 L 8.4199 47.3186 C 17.38 52.6596 28.3758 53.3168 37.9082 49.081 C 47.1884 44.9572 53.1693 35.7548 53.1693 25.5997 V 15.4766 C 53.1693 6.9291 60.0983 0 68.6458 0 H 456.528 C 646.807 0.562 681.415 -9.925 677.22 32.024 V 381 C 678.269 406.421 654.148 402.227 656.246 404.324 H 5 C 8.9543 401 0 392.046 0 381 Z" />
				</clipPath>
			</svg>
			<svg className="svgs">
				<clipPath id="window-3">
					<path d="M 0 425 V 54.3931 C 0 51.1068 3.5795 49.072 6.4033 50.7531 L 9.3674 52.5178 C 19.3169 58.4412 31.5216 59.1701 42.1055 54.4729 C 52.4249 49.8931 59.0769 39.6632 59.0769 28.3731 V 17.1693 C 59.0769 7.6869 66.7639 0 76.2462 0 H 1033.965 C 1045.611 -2.333 1068.903 -3.789 1067.447 29.693 V 424.321 C 1067.524 449.184 1065.478 449.184 1031.714 450.207 H 20 C 8.9543 445 0 436.046 0 425 Z" />
				</clipPath>
			</svg>
			<svg className="svgs">
				<clipPath id="window-4">
					<path d="M 0 470 V 59.6971 C 0 56.1856 3.842 54.0265 6.8415 55.8524 L 9.8589 57.6891 C 20.6902 64.2824 34.0813 65.0924 45.6283 59.8526 C 56.5848 54.8808 63.6213 43.9607 63.6213 31.9289 V 19.0147 C 63.6213 8.5132 72.1345 0 82.636 0 H 1951.616 C 1988.942 0.681 1999.377 2.284 2000 39.467 V 460.142 C 2000.468 493.082 1993.112 503.781 1961.682 506.456 H 20 C 8.9543 490 0 481.046 0 470 Z" />
				</clipPath>
			</svg>
		</>
	);
}

function Student({
	uid,
	email,
	name,
	avatarURL,
	beneficiary,
	group,
	prevGroup,
	blockedLesson,
	course,
	setLoadedGroups,
	lessonNumber,
	questionnaireInfo,
	oneGroupStore,
	oneUserStore,
}) {
	const [isModalMoveVisible, setIsModalMoveVisible] = useState(false);
	const [isModalRemoveVisible, setIsModalRemoveVisible] = useState(false);
	const [isModalBeneficiaryVisible, setIsModalBeneficiaryVisible] = useState(false);
	const [benefits, setBenefits] = useState(beneficiary);
	const [isInfoModalVisible, setIsShowModalVisible] = useState(false);
	const [isActive, setIsActive] = useState(false); //todo пока так, потом будет приходить в данных студента
	const [isOpenAccessModalVisible, setIsOpenAccessModalVisible] = useState(false);

	const openAccessToCourse = () => {
		// todo ждём от бэка: получения isActive в свойствах студента, метод изменения статуса isActive, метод получения токена для ссылки
		// sendLink(); todo дописать этот метод
		setIsActive(!isActive);
		setIsOpenAccessModalVisible(false);
	}

	const handleCancelBeneficiary = () => {
		setIsModalBeneficiaryVisible(false);
		clearSelect('courseSelect');
		clearSelect('groupSelect');
	};

	async function deleteUser() {
		await oneGroupStore.removeUser(uid);
		setLoadedGroups(false);
		setIsModalRemoveVisible(false);
	}

	async function changeBeneficiaryStatus() {
		await oneUserStore.setBeneficiaryStatus(uid);
		setBenefits(true);
		setIsModalBeneficiaryVisible(false);
	}

	function deleteBeneficiary() {
		oneUserStore.deleteBeneficiaryStatus(uid);
		setBenefits(false);
		setIsModalBeneficiaryVisible(false);
	}

	function clearSelect(id) {
		let select = document.getElementById(id);
		select.selectedIndex = 0;
	}

	const classNameStudent = blockedLesson
		? ` student student-blocked`
		: 'student';


	const showInfoModal = (value) => {
		setIsShowModalVisible(value);
	};

	return (
		<>
			<div className="student-avatar-admin">
				<img
					className=""
					src={avatarURL ? avatarURL : FrontendAvatar}
					alt="avatar"
				/>
			</div>
			<div className={classNameStudent}>
				<div className="student-info">
					<div className="student-info_container">
						<Link
							to={`/student-profile/${uid}`}
							key={uid}
						>
							<div className="student-name">
								{name}
							</div>
						</Link>
						<p className="student-email-admin">{email}</p>
						{prevGroup && (
							<span className="movedInfo">
								Переведена из {prevGroup}{' '}
							</span>
						)}
					</div>
					<div className="student__icons">
						{!isActive &&
							<button
								className="confirm-access-button"
								onClick={()=>setIsOpenAccessModalVisible(true)}
							>
								<div className="movedInfo">Ожидает доступ к<br/> личному кабинету</div>
							</button>
						}
						<OpenAccessToCourseModal
							open={isOpenAccessModalVisible}
							onOk={() => setIsOpenAccessModalVisible(false)}
							onClick={openAccessToCourse}
						/>
						{questionnaireInfo && (
							<>
								<button
									type="button"
									onClick={() => showInfoModal(true)}
									style={{boxShadow: 'none'}}
								>
									<img
										className="icon"
										src={iconInfo}
										alt="info"
									/>
								</button>
								<IntroInfoModal
									isVisible={isInfoModalVisible}
									handleVisible={showInfoModal}
									questionnaireInfo={questionnaireInfo}
								/>
							</>
						)}

						<button
							type="button"
							onClick={() => setIsModalBeneficiaryVisible(true)}
							style={{boxShadow: 'none'}}
						>
							<img
								className="icon icon-beneficiary"
								src={benefits ? starYellow : starDefault}
								alt="beneficiary"
							/>
						</button>
						<BenefitsModal
							name={name}
							course={course}
							open={isModalBeneficiaryVisible}
							onOk={() => setIsModalBeneficiaryVisible(false)}
							onCancel={handleCancelBeneficiary}
							onClick={deleteBeneficiary}
							onClick1={changeBeneficiaryStatus}
						/>

						<button
							type="button"
							onClick={() => setIsModalMoveVisible(true)}
							style={{boxShadow: 'none'}}
						>
							<img className="icon" src={iconEdit} alt="edit"/>
						</button>
						<EditStudentModal
							course={course}
							group={group}
							isModalMoveVisible={isModalMoveVisible}
							setIsModalMoveVisible={setIsModalMoveVisible}
							clearSelect={clearSelect}
							uid={uid}
							lessonNumber={lessonNumber}
							setLoadedGroups={setLoadedGroups}
							name={name}
						/>
						<button
							type="button"
							onClick={() => setIsModalRemoveVisible(true)}
							style={{boxShadow: 'none'}}
						>
							<img
								className="icon"
								src={iconDelete}
								alt="delete"
							/>
						</button>
						<DeleteStudentModal
							name={name}
							open={isModalRemoveVisible}
							onOk={() => setIsModalRemoveVisible(false)}
							onClick={deleteUser}
						/>
					</div>
				</div>
			</div>
			<SvgBackgrounds/>
		</>
	);
}

export default inject(
	({ oneGroupStore, groupsStore, coursesStore, oneUserStore }) => {

		useEffect(() => {
			coursesStore.loadDataCourse();
		}, []);

		useEffect(() => {
			groupsStore.loadData();
		}, [groupsStore.isLoaded]);

		return {
			oneGroupStore,
			groupsStore,
			coursesStore,
			oneUserStore,
		};
	}
)(observer(Student));
