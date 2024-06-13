import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import coursesIcon from "../../assets/controls/courses-icon.svg";
import chatIcon from "../../../student/assets/controls/chat_img_muted.svg";
import meetingIcon from "../../assets/controls/meeting-icon.svg";
import notificationIcon from "../../assets/controls/notification-icon.svg";
import progressIcon from "../../assets/controls/icons-progress-24.png";
import { inject, observer } from "mobx-react";

function SidebarNavigation({
	// uid, oneUserStore, chatStore,
	course }) {
	const location = useLocation();
	const { pathname } = location;

	const [notification, setNotification] = useState(false);
	const [isChatMessage, setIsChatMessage] = useState(false);

	// useEffect(() => {
	// 	oneUserStore.getNotifs(uid).then((result) => {
	// 		result.every((notice) => notice.seen === true)
	// 			? setNotification(false)
	// 			: setNotification(true);
	// 	});
	// });

	// useEffect(() => {
	// 	const unseenMessage = chatStore.getUnseenMessagesCount(uid);
	// 	setIsChatMessage(Boolean(unseenMessage));
	// });

	return (
		<section className=" sidebar__nav-container sidebar__navigate">
			<nav>
				<Link
					to={`/${course}/game`}
					className="sidebar__nav"
				>
					<img
						className="btn_settings"
						src={coursesIcon}
						alt="courses icon"
					/>
					<p className={pathname === "" || pathname.includes("/:course/game") ? "active sidebar-text" : "sidebar-text"}>
						Курсы
					</p>
				</Link>
				<Link
					to={`/${course}/messenger`}
					className="sidebar__nav"
				>
					<div className="notification-icon">
						<img
							className="btn_settings"
							src={chatIcon}
							alt="chat-icon"
						/>
						{isChatMessage &&
							<span className="tab-notification" />
						}
					</div>
					<p className={pathname === "/:course/messenger" ? "active sidebar-text" : "sidebar-text"}>
						Чат
					</p>
				</Link>
				<Link
					to='/group-meeting'
					className="sidebar__nav"
				>
					<img
						className="btn_settings"
						src={meetingIcon}
						alt="meeting icon"
					/>
					<p className={pathname === "/group-meeting" ? "active sidebar-text" : "sidebar-text"}>
						Созвоны
					</p>
				</Link>
				<Link
					to={`/${course}/notification`}
					className="sidebar__nav"
				>
					<div className="notification-icon">
						<img
							className="btn_settings"
							src={notificationIcon}
							alt="notificationIcon"
						/>
						{notification &&
							<span className="tab-notification" />
						}
					</div>
					<p className={pathname === "/:course/notification" ? "active sidebar-text" : "sidebar-text"}>
						Уведомления
					</p>
				</Link>
				<Link
					to='/progress/career'
					className="sidebar__nav"
				>
					<img
						className="btn_settings"
						src={progressIcon}
						alt="notificationIcon"
					/>
					<p className={pathname.includes("/progress/") ? "active sidebar-text" : "sidebar-text"}>
						Прогресс
					</p>
				</Link>
			</nav>
		</section>
	);
}
export default
	// inject(({ auth, oneUserStore, chatStore }) => {
	// 	const { profile } = auth;
	// 	const uid = profile?.uid;
	// 	useEffect(() => {
	// 		chatStore.loadData();
	// 	}, [chatStore.isLoaded])

	// 	return {
	// 		uid,
	// 		oneUserStore,
	// 		chatStore,
	// 	};
	// })(observer(
	SidebarNavigation
	// ));
