import React, {useEffect, useState} from 'react';
import catAvatar from '../../../common/assets/avatars/pink-cat-avatar.svg';
import foxAvatar from '../../../common/assets/avatars/orange-fox-avatar.svg';
import pandaAvatar from '../../../common/assets/avatars/panda-avatar.svg';
import penguinAvatar from '../../../common/assets/avatars/penguin-avatar.svg';
import roundArrow from '../../../common/assets/controls/arrows/round_arrow.svg';
import './ChooserAvatar.scss'
import {Modal} from "antd";

function ChooserAvatar({ setIsAvatar, isAvatar, changeAvatar, setChangeAvatar, studentData, isNew}) {
	const [isVisible, setIsVisible] = useState(false);
	const [avatarIndex, setAvatarIndex] = useState(0);
	const avatarArr = [catAvatar, foxAvatar, pandaAvatar, penguinAvatar];
	const  onboardingDone = studentData.studentData.status.name === "new";

	useEffect(() => {
		if ((onboardingDone && isNew && !isAvatar) || changeAvatar) {
			setIsVisible(true);
		}
	}, [onboardingDone, isNew, changeAvatar]);

	const showPrevAvatar = () => {
		const newIndex = avatarIndex - 1;
		setAvatarIndex(newIndex);
	}
	const showNextAvatar = () => {
		const newIndex = avatarIndex + 1;
		setAvatarIndex(newIndex);
	}

	const handleUploadFile = async () => {
		if (!avatarArr[avatarIndex]) {
			return;
		}
		const avatar = {
			name:avatarArr[avatarIndex],
		};
		// await auth.updateAvatar(uid, avatar.name, avatar.name);
	};

	const chooseAvatar = () => {
		// handleUploadFile();
		localStorage.setItem('avatar', "true");
		setIsVisible(false);
		setIsAvatar(true);
		setChangeAvatar(false);
	}

	const skipChooseAvatar = () => {
		setIsVisible(false);
		setIsAvatar(true);
		setChangeAvatar(false);
	}

	return (
		<Modal open={isVisible} footer={null} className="questionnaire-modal">
		    <div className="questionnaire-modal__avatar-container">
				<h1 className="questionnaire-modal__avatar-title">Выбери аватар</h1>
				<div className="questionnaire-modal__avatar-content" >
					<button
						className="questionnaire-modal__avatar-arrow questionnaire-modal__avatar-arrow_left"
						onClick={showPrevAvatar}
						disabled={avatarIndex === 0}
					>
						<img src={roundArrow} alt="arrow"/>
					</button>
					<div>
						<img src={avatarArr[avatarIndex]} alt="avatar"/>
					</div>
					<button
						className="questionnaire-modal__avatar-arrow"
						onClick={showNextAvatar}
						disabled={avatarIndex === avatarArr.length-1}
					>
						<img src={roundArrow} alt="arrow"/>
					</button>
				</div>
				<button
					className="questionnaire-modal__avatar-choose"
					onClick={chooseAvatar}
				>
					Выбрать
				</button>
				<button
					className="questionnaire-modal__avatar-skip"
					onClick={skipChooseAvatar}
				>
					Пропустить
				</button>
			</div>
        </Modal>
	)
}
export default ChooserAvatar;

