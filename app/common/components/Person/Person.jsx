import React, { useEffect, useState } from 'react';
import FrontendAvatar from '../../../common/assets/defaultAvatars/frontend-avatar.png';
import iconEdit from '../../../common/assets/controls/icon-edit.svg';
import iconDelete from '../../../common/assets/controls/icon-delete.svg';
import iconBlockedGroups from '../../assets/controls/icon-blocked.png';
import './Person.scss';
import { Button, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import BlockMentorGroupsModal from './ModalWindows/BlockMentorGroupsModal';
import DeleteMentorModal from './ModalWindows/DeleteMentorModal';
import MentorForm from '../../pages/Form/AddMentorForm/MentorForm';

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

function Person({
	id,
	name,
	avatarURL,
	deleteMentorFromDB,
	setLoaded,
	groups,
	deleteMentor,
	groupsStore,
	blockedGroups,
	mentorsStore,
}) {
	const [deleteMentorModalVisible, setDeleteMentorModalVisible] =
		useState(false);
	const [editMentorModalVisible, setEditMentorModalVisible] =
		useState(false);
	const [isBlockedGroupsModalVisible, setIsBlockedGroupsModalVisible] =
		useState(false);
	const mentorGroups = Object.keys(groups);
	const showDeleteMentorModal = (value) => {
		setDeleteMentorModalVisible(value);
	};

	const handleDeleteMentor = () => {
		deleteMentorFromDB();
		setLoaded(false);
		if (mentorGroups.length > 0) {
			mentorGroups.forEach((group) => deleteMentor(id, group));
			groupsStore.setLoaded(false);
		}
	};

	return (
		<div className="person__wrap">
			<div className="person__avatar">
				<img
					className="person__avatar-img"
					src={avatarURL ? avatarURL : FrontendAvatar}
					alt="avatar"
				/>
			</div>
			<div className="person">
				<div className="person__info">
					<div className="person__info-container">
						<div className="person__name">{name}</div>
					</div>
					<div className="person__icons">
						<button
							type="button"
							style={{ boxShadow: 'none' }}
							onClick={() => setIsBlockedGroupsModalVisible(true)}
						>
							<img src={iconBlockedGroups} alt="blockedGroups" />
						</button>
						<button
							type="button"
							onClick={() => setEditMentorModalVisible(true)}
						>
							<img src={iconEdit} alt="edit" />
						</button>
						<button
							type="button"
							className="person__icon"
							onClick={() => showDeleteMentorModal(true)}
						>
							<img src={iconDelete} alt="delete" className="person__icon_delete" />
						</button>
					</div>
				</div>
			</div>
			<DeleteMentorModal
				showDeleteMentorModal={showDeleteMentorModal}
				deleteMentorFromDB={handleDeleteMentor}
				isVisible={deleteMentorModalVisible}
				id={id}
				name={name}
			/>
			<Modal
				open={editMentorModalVisible}
				onOk={() => setEditMentorModalVisible(false)}
				onCancel={() => setEditMentorModalVisible(false)}
				className="mentorModal"
				footer={null}
			>
				<MentorForm
					setIsMentorFormModalVisible={setEditMentorModalVisible}
					setLoaded={mentorsStore.setLoaded}
					mentors={mentorsStore.mentors}
					isEdit={true}
					id={id}
				/>
			</Modal>
			<Modal
				open={isBlockedGroupsModalVisible}
				title={`Заблокировать группы ${name}`}
				onOk={() => setIsBlockedGroupsModalVisible(false)}
				onCancel={() => setIsBlockedGroupsModalVisible(false)}
				footer={null}
				className="mentorModal signup-modal"
			>
				<BlockMentorGroupsModal
					id={id}
					groups={groupsStore.groups}
					setIsBlockedGroupsModalVisible={
						setIsBlockedGroupsModalVisible
					}
					blockedGroups={blockedGroups}
				/>
			</Modal>

			<SvgBackgrounds />
		</div>
	);
}

export default inject(({ oneGroupStore, groupsStore, mentorsStore }) => {
	const { deleteMentor } = oneGroupStore;

	useEffect(() => {
		groupsStore.loadData();
	}, [groupsStore.isLoaded]);

	return {
		deleteMentor,
		groupsStore,
		mentorsStore
	};
})(observer(Person));
