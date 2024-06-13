import React from "react";
import BackArrow from "../../../../common/components/BackArrow/BackArrow";
import Input from "../../../../common/components/Input/Input";
import Button from "../../../../common/components/Button/Button";
import Eye from "../../../assets/controls/password/eye.svg";
import ClosedEye from "../../../assets/controls/password/closedEye.svg";
import "./PasswordChange.scss";

function PasswordChange() {
	return (
		<div className="settings">
			<div className="profileSettings-nav">
				<nav className="settings-nav">
					<BackArrow />
					<p className="profileSettings-nav_div">Настройки</p>
					<div className="settings-nav__hidden">Настройки</div>
				</nav>
			</div>

			<div className="settingsPassword common">
				<form action="">
					<>
						{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					</>
					<label htmlFor="oldPass">Старый пароль</label>
					<div className="container">
						<Input type="text" readOnly name="oldPass" />
						<img
							src={ClosedEye}
							className="closedEyeImg"
							alt="closed-eye"
						/>
					</div>
					<>
						{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					</>
					<label htmlFor="newPass">Новый пароль</label>
					<div className="container">
						<Input type="text" readOnly name="newPass" />
						<img src={Eye} className="eyeImg" alt="eye" />
					</div>
					<>
						{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					</>
					<label htmlFor="againNewPass">Повторите новый пароль</label>
					<div className="container">
						<Input type="text" readOnly name="againNewPass" />
						<img src={Eye} className="eyeImg" alt="eye" />
					</div>
				</form>
				{/* <button className="savePass-btn" type="button">Сохранить</button> */}
				<Button
					className="profile__btn_info settings-btn"
					text="Сохранить"
				/>
			</div>
		</div>
	);
}

export default PasswordChange;
