import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../components/Input/Input';
import '../../../../styles/forms.scss';
import FormsModel from '../../../models/FormsModel';
import Background from '../../../../assets/images/background-desktop.jpg';
import { loginService } from "../../../apollo/services/AuthService";
import { writeUser } from "../../../apollo/localState/UserLocalState";
import './LoginForm.scss';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailDirty, setEmailDirty] = useState(false);
	const [passwordDirty, setPasswordDirty] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState(
		'Email не может быть пустым'
	);
	const [passwordError, setPasswordError] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState(
		'Пароль не может быть пустым'
	);
	const [error, setError] = useState('');

	async function submitHandler(e) {
		e.preventDefault();
		localStorage.removeItem('lessonlyCrystals');
		setError('');
		const { token, userId, roleId, studentId } = await loginService(email, password);
		if (token) {
			writeUser(email, userId, roleId, studentId);
		}

		// e.preventDefault();
		// localStorage.removeItem('weeklyCrystals');
		// setLoading(true);
		// setError('');
		// const loginResult = await login(email, password);
		//
		// if (!loginResult.success) {
		// 	setError(loginResult.message);
		// 	setLoading(false);
		// }
	}

	const emailHandler = (e) => {
		setEmail(e.target.value.trim());
		// const re =         // todo пока бэк не заменит имя на почту
		// 	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		// if (!re.test(String(e.target.value).toLowerCase()) || !e.target.value) {
		// 	const errorMessage = !e.target.value
		// 		? 'Email не может быть пустым'
		// 		: 'Некорректный email';
		// 	setEmailError(true);
		// 	setEmailErrorMessage(errorMessage);
		// } else {
		// 	setEmailError(false);
		// }

		// setEmail(e.target.value.trim());
		// const errors = formsModel.validateEmail(e.target.value);
		// if (errors !== '') {
		// 	setEmailError(true);
		// 	setEmailErrorMessage(errors);
		// } else {
		// 	setEmailError(false);
		// }
	};

	const passwordHandler = (e) => {
		setPassword(e.target.value.trim());
		if (e.target.value.length < 3 || e.target.value.length > 20) {
			setPasswordError(true);
			// setPasswordErrorMesssage(errors);
		} else {
			setPasswordError(false);
		}

		// setPassword(e.target.value.trim());
		// const errors = formsModel.validatePassword(e.target.value);
		// if (errors !== '') {
		// 	setPasswordError(true);
		// 	setPasswordErrorMesssage(errors);
		// } else {
		// 	setPasswordError(false);
		// }
	};

	const blurHandler = (e) => {
		switch (e.target.name) {
			case 'email':
				setEmailDirty(true);
				break;
			case 'password':
				setPasswordDirty(true);
				break;
			default:
				console.log('Что-то по дефолту');
		}
	};

	const [passwordShown, setPasswordShown] = useState(false);
	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	return (
		<div
			className="authFormWrapper"
			style={{
				background: `url(${Background})`,
				backgroundSize: 'cover',
			}}
		>
			<form className="authForm" onSubmit={submitHandler}>
				<h1 className="authForm__title">Продолжим обучение</h1>
				<span style={{ textAlign: 'center' }}>{error}</span>
				{emailDirty && emailError && (
					<div className="authForm__error-message">
						{emailErrorMessage}
					</div>
				)}
				<Input
					className="authForm__input"
					onChange={(e) => emailHandler(e)}
					value={email}
					// onBlur={(e) => blurHandler(e)}
					name="email"
					// type="email"
					placeholder="Почта"
					// minLength="6"
					required
				/>
				{passwordDirty && passwordError && (
					<div className="authForm__error-message">
						{passwordErrorMessage}
					</div>
				)}
				<Input
					className="authForm__input"
					onChange={(e) => passwordHandler(e)}
					value={password}
					onBlur={(e) => blurHandler(e)}
					name="password"
					type={passwordShown ? 'text' : 'password'}
					placeholder="Пароль"
					// minLength="5"
					maxLength="15"
					required
				/>
				<div className="password-questions">
					<button type="button" onClick={togglePassword}>
						<div className="authForm__text">
							{passwordShown
								? 'Скрыть пароль'
								: 'Показать пароль'}
						</div>
					</button>
					<Link
						to="/forgot-password"
						className="authForm__text forgot-link"
					>
						<button type="button" className="forgotBtn">
							Забыли пароль?
						</button>{' '}
					</Link>
				</div>

				<div className="authForm__controls">
					<button
						className="authForm__button button"
						type="submit"
						disabled={!email || !password}
					>
						Войти
					</button>
					<div className="bottom-question">
						<p className='bottom-question__text'>Пока нет аккаунта?{' '}</p>
						<Link to="/signup" className="miniTitle ">
							<button className="signup-button button">
								Создать профиль
							</button>
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
};

// export default inject(({ auth }) => {
// 	const { login } = auth;
// 	const formsModel = new FormsModel(auth);
// 	return {
// 		login,
// 		formsModel,
// 	};
// })(observer(LoginForm));
export default LoginForm;
