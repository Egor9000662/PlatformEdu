import React from "react";
import "./StudentName.scss";
import avatar from "../../../common/assets/defaultAvatars/frontend-avatar.png";

function StudentName(props) {
	const { name, nickname, avatarURL } = props;
	return (
		<div className="StudentName">
			<img
				className="StudentProfile_avatar"
				src={avatarURL ? avatarURL : avatar}
				alt="avatar"
			/>
			<div className="Student_name">{name}</div>
			<div className="StudentNickname">{nickname}</div>
		</div>
	);
}

export default StudentName;
