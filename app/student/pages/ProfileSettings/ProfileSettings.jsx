import React, { useState, useEffect } from 'react';
import { Switch, TimePicker, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Input from '../../../common/components/Input/Input';
import Button from '../../../common/components/Button/Button';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import './ProfileSettings.scss';
import facebookLogo from '../../assets/logos/facebook-logo.png';
import googleLogo from '../../assets/logos/google-logo.png';
import CountrySelect from '../../components/CountrySelect/CountrySelect';
import DownloadAvatar from '../../components/DownloadAvatar/DownloadAvatar';
import HomeButon from '../../../common/components/HomeButton/HomeButton';
import {writeUser} from "../../../common/apollo/localState/UserLocalState";

function ProfileSettings({
	name,
	nickname,
	email,
	uid,
	updateName,
	updateNick,
	createCountry,
	getCountry,
	user,
	logout,
}) {
	const [userCountry, setUserCountry] = useState(null);
	const [countries, setCountries] = useState([]);
	const history = useHistory();

	useEffect(() => {
		fetch('https://api.hh.ru/areas')
			.then((res) => res.json())
			.then((json) => {
				setCountries(json);
			});
	}, []);

	useEffect(async () => {
		const result = await getCountry(uid);
		setUserCountry(result);
	}, [uid]);

	// const [isPasswordChanging, setPasswordChanging] = useState(false);
	const studentName = React.createRef();
	const studentNick = React.createRef();
	const [namesValue, setNameValue] = React.useState(
		`${studentName.defaultValue}`
	);
	const [nickValue, setNickValue] = React.useState(
		`${studentNick.defaultValue}`
	);

	const handleStudentName = (event) => {
		setNameValue(event.target.defaultValue);
	};

	const handleStudentNick = (event) => {
		setNickValue(event.target.defaultValue);
	};
	const handleCountryName = (event) => {
		setUserCountry(event.target.value);
	};

	const successSaving = (text) => {
		message.success(text);
	};

	const saveSettings = async () => {
		updateName(uid, studentName.current.value);
		updateNick(uid, studentNick.current.value);
		createCountry(uid, userCountry);
		successSaving('Изменения сохранены');
		history.push('/profile');
	};

	// const handlePasswordChange = () => {
	// 	setPasswordChanging(true);
	// };

	const [error, setError] = useState('');

	async function handleLogOut() {
		setError('');
		try {
			writeUser(null, null, null, null)
			localStorage.removeItem("username");
			localStorage.removeItem("roleId");
			localStorage.removeItem("token");
			history.push("/login");
		} catch (err) {
			setError('Failed to log out');
			console.log(err);
		}
	}
	const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
	return (
		<div>
			<div className="settings">
				{isDesktop
					? <h1 className="profileSettings-nav_title">Настройки</h1>
					: <div className="profileSettings-nav">
						<nav className="settings-nav">
							<BackArrow pathName={'/profile'} />
							<p className="profileSettings-nav_div">Настройки</p>
							<HomeButon />
						</nav>
					</div>
				}
				<div className="settingsProfile-container">
					<div className="settingsProfile common">
						<h1>Профиль</h1>
						<div className="settingsAvatar">
							<DownloadAvatar />
						</div>
						{/* <p>Загрузить фото</p> */}
						<form action="">
							{/* TODO: уточнить, для чего код в фрагменте ниже */}
							<>
								{' '}
								{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}{' '}
							</>
							<label htmlFor="studentName">Имя</label>
							<Input
								name="studentName"
								defaultValue={name}
								ref={studentName}
								onChange={handleStudentName}
							/>
							<>
								{' '}
								{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}{' '}
							</>
							<label htmlFor="studentNick">
								Имя пользователя
							</label>
							<Input
								name="studentNick"
								defaultValue={nickname}
								ref={studentNick}
								onChange={handleStudentNick}
							/>
							<>
								{' '}
								{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}{' '}
							</>
							{/* <label htmlFor="userPassword">Пароль</label>
							<Input
								name="userPassword"
								readOnly
								type="password"
							/> */}

							{/* <Link to="/change-password">
								<p className="changePassword">
									Изменить пароль*
								</p>
							</Link> */}

							<label htmlFor="userMail">Электронная почта</label>
							<Input name="userMail" readOnly value={email} />
							<>
								{' '}
								{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}{' '}
							</>
							<label htmlFor="userCountry">Страна/регион</label>
							<CountrySelect
								countries={countries}
								name="userCountry"
								value={
									userCountry || 'Выберите страну/регион...'
								}
								handleCountryName={handleCountryName}
							/>
						</form>
						<Button
							// onClick={saveSettings}
							className="profile__btn_info settings-btn"
							text="Сохранить"
						/>
					</div>
					<div className="profile-question_container">
						{/*<p className="profile-question">*/}
						{/*	У вас есть курс и вы хотите стать частью нашей*/}
						{/*	платформы?*/}
						{/*</p>*/}
						<div className="profile-question_item">
							<Button
								className="settingsBtn greenBtn settings-btn"
								text="Стать преподавателем"
							/>{' '}
							{error && error}
						</div>
						<div className="profile-question_item">
							{/*{user && (*/}
								<Button
									onClick={handleLogOut}
									className="settings-btn redBtn"
									text="Выйти из кабинета"
								/>
							{/*)}*/}
						</div>
					</div>
					<div className="settings-right">
						<div className="settingsAccounts common">
							<h1>Привязка аккаунтов</h1>
							<div className="accountsRow firstRow">
								<div className="social">
									<img src={facebookLogo} alt="" />
									<span>Facebook</span>
								</div>
								<Switch />
							</div>
							<div className="accountsRow">
								<div className="social">
									<img src={googleLogo} alt="" />
									<span>Google</span>
								</div>
								<Switch />
							</div>
						</div>
						<div className="settingsNotifications common">
							<h1>Уведомления</h1>
							<div className="notificationRow firstRow">
								<span>Напоминание о занятиях</span>
								<Switch />
							</div>
							<div className="notificationRow">
								<span>Время напоминания</span>
								<TimePicker
									defaultValue={moment(moment(), 'HH:mm')}
									format="HH:mm"
								/>
							</div>
						</div>
					</div>
					{/* <Switch /> */}
				</div>
				{/* <div className="accountsRow">
					<div className="social">
						<img src={googleLogo} alt="" />
						<span>Google</span>
					</div>
					<Switch />
				</div>
				<div className="settingsPrivacy common">
					<h1>Конфиденциальность</h1>
					<Button
						className="profile__btn_info settings-btn"
						text="Сайт"
					/>
					<Button
						className="profile__btn_info settings-btn"
						text="Условия"
					/>
					<Button
						className="profile__btn_info settings-btn"
						text="Конфиденциальность"
					/>
				</div> */}
			</div>
		</div>
	);
}

export default inject(({ auth }) => {
	const {
		user,
		logout,
		profile,
		createCountry,
		getCountry,
		updateName,
		updateNick,
	} = auth;
	return {
		email: user?.email,
		uid: user?.uid,
		name: profile?.name,
		nickname: profile?.nickname,
		createCountry,
		getCountry,
		updateName,
		updateNick,
		user,
		logout,
	};
})(observer(ProfileSettings));
