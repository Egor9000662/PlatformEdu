import shine from "../../assets/progressModal/shine.svg";
import fighter from "../../assets/achievementIcons/fighter.png";
import {Link} from "react-router-dom";
import React from "react";
import './BodyNoticeAchievementMessage.scss'

export  default function BodyNoticeAchievementMessage(props) {
	const  {notice, text, urgency, uid, taskId, state, handleNotif} = props;

	return (
		<div className="notice-container">
			<div className="notice__img"
				 style={{ backgroundImage: `url(${shine})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
			>
				<img src={fighter} alt={fighter}/>
			</div>
			<div className="notice__message-container">
				<div className="notice__title">Тема: {notice}</div>
				<div className="notice__phrase">{text}</div>
				<div className="notice__btns">
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
				</div>
			</div>
		</div>
	)
}
