import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import BackArrow from "../../../common/components/BackArrow/BackArrow";
import UrgentNoticeMessage from "../../components/UrgentNoticeMessage/UrgentNoticeMessage";
import './UrgentNoticePage.scss'

function UrgentNoticePage({oneUserStore, uid}) {

	const [messages, setMessages] = useState([]);
	useEffect(() => {
		oneUserStore.getNotifs(uid)
			.then((data) => setMessages(data));
	}, [uid]);

	const urgentMessages = [];
	for (let message of messages) {
		if(message.urgentNotices){
			urgentMessages.push(message)
		}
	}

	return(
		<div className="urgentNotice_container">
			<div className="urgentNotice_header">
				<BackArrow pathName={'/notification'} />
				<h1 className="urgentNotice_title">Важные уведомления</h1>
			</div>
			<main className="urgentNotice_body">
				{urgentMessages
					.reverse()
					.map((message)=>
					<UrgentNoticeMessage
						key={message.nid}
						{...message}
					/>
				)}
			</main>
		</div>
	)}
export default inject(({ auth, oneUserStore })=>{
	const { uid } = auth.user;
	return {
		oneUserStore,
		uid,
	}
})(observer(UrgentNoticePage));
