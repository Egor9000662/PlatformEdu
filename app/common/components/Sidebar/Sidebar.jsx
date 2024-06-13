import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SettingsPic from '../../assets/controls/all_settings_icon.svg';
import SidebarNavigation from "./SidebarNavigation";
import SidebarUserInfo from "./SidebarUserInfo";
import './Sidebar.scss'

export default function Sidebar({ step2Ref, step5Ref, hideSidebar, setChangeAvatar, course, studentData }) {

	const location = useLocation();
	const { pathname } = location;

	return (
		<aside className={hideSidebar ? "sidebar-container sidebar-hidden" : "sidebar-container"} ref={step2Ref}>
			<SidebarUserInfo step5Ref={step5Ref} setChangeAvatar={setChangeAvatar} studentData={studentData}/>
			<SidebarNavigation course={course} />
			<section className=" sidebar__nav-container sidebar__settings">
				<nav>
					<div className="sidebar__nav">
						<img
							className="btn_settings"
							src={SettingsPic}
							alt="settings_icon"
						/>
						<Link
							to='/profile-settings'
						>
							<p className={pathname === "/profile-settings" ? "active sidebar-text" : "sidebar-text"}>Настройки</p>
						</Link>
					</div>
				</nav>
			</section>
		</aside>
	)
}

