import React from "react";
import { formatTime } from "../../../modules/format-date";
import './UrgentNoticeMessage.scss';
import Enum from "../../../enum";

export default function UrgentNoticeMessage(props) {

	const { text, notice, from, date } = props;
	let timeMessage = formatTime(date);
	const author = from === 'teacher' ? Enum.teacher : Enum.admin

	return (
		<div className="message_container">
			<div className="message_header">
				<div className="message_title" >{`От: ${author}`}</div>
				<div className="message_date">{timeMessage}</div>
			</div>
			<div className="message_notice">{`Тема: ${notice}`}</div>
			<div className="message_text">{text}</div>
		</div>
	)
};
