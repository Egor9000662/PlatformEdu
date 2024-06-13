import {Link} from "react-router-dom";
import React from "react";
import './NotificationStudent.scss'

export default function BodyNoticeMessage(props) {
	const  {notice, text, urgency, uid, taskId, state, handleNotif} = props;

	return (
		<div className="body__notice">
			<div className="topic__notice">{notice}</div>
			<div className="text__notice">{text}</div>
			{urgency !== 1 && (
				<Link
					className="link__notice"
					to={{
						pathname: `/chat/${uid}/${taskId}`,
						state: state,
					}}
					onClick={handleNotif}
				>
					{" "}
					<span>Посмотреть</span>{" "}
				</Link>
			)}
			{urgency === 1 && (
				<Link
					className="link__notice"
					to="/urgent-notices"
				>
					{" "}
					<span>Посмотреть</span>{" "}
				</Link>
			)}
		</div>
	)
};
