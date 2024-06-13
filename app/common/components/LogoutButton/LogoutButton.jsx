import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import LogoutIcon from "../../../common/assets/controls/logout-icon.png";
import './LogoutButton.scss'
import {writeUser} from "../../apollo/localState/UserLocalState";


function LogoutButton() {
	const history = useHistory()
const handleLogOut =  ()=>{
	writeUser(null, null, null, null)
	localStorage.removeItem("username");
	localStorage.removeItem("roleId");
	localStorage.removeItem("token");
	history.push("/login");
}

	return (
		<>
				<button type="button" onClick={handleLogOut	}>
					<img
						className="home-icon"
						src={LogoutIcon}
						alt="logout"
						title="Выйти"
					/>
				</button>
		</>
	);
}

export default LogoutButton;
