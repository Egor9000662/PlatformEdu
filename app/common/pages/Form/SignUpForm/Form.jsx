import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import FormsModel from '../../../models/FormsModel';
import Background from '../../../../assets/images/background-desktop.jpg';
import { signUpByLinkService } from "../../../apollo/services/AuthService";
import './Form.scss';
import { writeUser } from "../../../apollo/localState/UserLocalState";
import eye from "../../../../owner/assets/controls/eye.svg";
import closedEye from "../../../../owner/assets/controls/closedEye.svg";

const Form = () => {
	const [FirstName, setFirstName] = useState('');
	const [LastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [phone, setPhone] = useState('');

	const [FirstNameError, setFirstNameError] = useState(false);
	const [FirstNameDirty, setFirstNameDirty] = useState(false);
	const [LastNameError, setLastNameError] = useState(false);
	const [LastNameDirty, setLastNameDirty] = useState(false);
	const [emailDirty, setEmailDirty] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [passwordDirty, setPasswordDirty] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [passwordConfirmationDirty, setPasswordConfirmationDirty] = useState(false);
	const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
	const [phoneDirty, setPhoneDirty] = useState(false);
	const [phoneError, setPhoneError] = useState(false);

	const [FirstNameErrorMessage, setFirstNameErrorMessage] = useState('Не жалей символов');
	const [LastNameErrorMessage, setLastNameErrorMessage] = useState('Не жалей символов');
	const [phoneErrorMessage, setPhoneErrorMessage] = useState('Номер телефона не может быть пустым');
	const [emailErrorMessage, setEmailErrorMessage] = useState('Email не может быть пустым');
	const [passwordErrorMessage, setPasswordErrorMesssage] = useState('Пароль не может быть пустым');
	const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState('Пароли не совпадают');

	const [error, setError] = useState('');
	const [isLoading, setLoading] = useState(false);

	const location = useLocation();
	const locationData = location.search;
	const params = new URLSearchParams(locationData);
	const dataFromUrl = Object.fromEntries(params.entries());
	const [email, setEmail] = useState(dataFromUrl.email || '');

	const formsModel = new FormsModel();

	async function submitHandler(e) {
		e.preventDefault();

		try {
			if (!error && !FirstNameError && !LastNameError && !emailError && !passwordError && !passwordConfirmationError && !phoneError
				&& dataFromUrl.workspace && dataFromUrl.courseId && dataFromUrl.groupId) {
				const { token, userId, roleId, studentId } = await signUpByLinkService(
					FirstName,
					LastName,
					email,
					password,
					phone,
					dataFromUrl.groupId,
					dataFromUrl.courseId,
					dataFromUrl.workspace,
				)
				if (token) {
					writeUser(email, userId, roleId, studentId);
				}
			}

			setError('');
			setLoading(true);
		} catch (err) {
			setError('Failed to create an account');
			console.log(err);
		}
	}

	const FirstNameHandler = (e) => {
		setError('');
		setFirstName(e.target.value.trim());
		const errors = formsModel.validateName(e.target.value, 'name');
		if (errors !== '') {
			setFirstNameError(true);
			setFirstNameErrorMessage(errors);
		} else {
			setFirstNameError(false);
		}
	};

	const LastNameHandler = (e) => {
		setError('');
		setLastName(e.target.value.trim());
		const errors = formsModel.validateName(e.target.value, 'surname');
		if (errors !== '') {
			setLastNameError(true);
			setLastNameErrorMessage(errors);
		} else {
			setLastNameError(false);
		}
	};

	const phoneHandler = (e) => {
		setError('');
		setPhone(e.target.value);
		const errors = formsModel.validatePhone(e.target.value);
		if (errors !== '') {
			setPhoneError(true);
			setPhoneErrorMessage(errors);
		} else {
			setPhoneError(false);
		}
	}

	const emailHandler = (e) => {
		setError('');
		setEmail(e.target.value.trim());
		const errors = formsModel.validateEmail(e.target.value);
		if (errors !== '') {
			setEmailError(true);
			setEmailErrorMessage(errors);
		} else {
			setEmailError(false);
		}
	};

	const passwordHandler = (e) => {
		setError('');
		setPassword(e.target.value.trim());
		const errors = formsModel.validatePassword(e.target.value);
		if (errors !== '') {
			setPasswordError(true);
			setPasswordErrorMesssage(errors);
		} else {
			setPasswordError(false);
		}
	};

	const passwordConfirmationHandler = (e) => {
		setError('');
		setPasswordConfirmation(e.target.value.trim());
		if (e.target.value !== password) {
			setPasswordConfirmationError(true);
			const errorMessage = 'Подтверждение пароля должно совпадать с паролем';
			setPasswordConfirmationErrorMessage(errorMessage);
		} else {
			setPasswordConfirmationError(false);
		}
	}

	const blurHandler = (e) => {
		switch (e.target.name) {
			case 'FirstName':
				setFirstNameDirty(true);
				break;
			case 'LastName':
				setLastNameDirty(true);
				break;
			case 'phone':
				setPhoneDirty(true);
			case 'email':
				setEmailDirty(true);
				break;
			case 'password':
				setPasswordDirty(true);
				break;
			case 'passwordConfirmation':
				setPasswordConfirmationDirty(true);
				break;
			default:
				console.log('Что-то по дефолту');
		}
	};

	const [passwordShown, setPasswordShown] = useState(false);
	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	const [passwordConfirmationShown, setPasswordConfirmationShown] = useState(false);
	const togglePasswordConfirmation = () => {
		setPasswordConfirmationShown(!passwordConfirmationShown);
	};

	return (
		<div
			className='authFormWrapper'
			style={{
				background: `url(${Background})`,
				backgroundSize: 'cover',
			}}
		>
			<form
				className='authForm' onSubmit={submitHandler}
			>
				<h1 className="authForm__title">Начнём обучение</h1>
				<span className="error-signup">{error}</span>
				{FirstNameDirty && FirstNameError && (
					<div className="authForm__error-message">
						{FirstNameErrorMessage}
					</div>
				)}
				<Input
					className="authForm__input"
					onChange={(e) => FirstNameHandler(e)}
					value={FirstName}
					onBlur={(e) => blurHandler(e)}
					name="FirstName"
					type="text"
					placeholder="Имя"
					minLength="2"
					maxLength="20"
					required
				/>
				{LastNameDirty && LastNameError && (
					<div className="authForm__error-message">
						{LastNameErrorMessage}
					</div>
				)}
				<Input
					className="authForm__input"
					onChange={(e) => LastNameHandler(e)}
					value={LastName}
					onBlur={(e) => blurHandler(e)}
					name="LastName"
					type="text"
					placeholder="Фамилия"
					minLength="2"
					maxLength="20"
				/>
				{phoneError && phoneDirty &&
					(<div className="authForm__error-message">
						{phoneErrorMessage}
					</div>)
				}
				<Input
					className="authForm__input"
					onChange={(e) => phoneHandler(e)}
					value={phone}
					onBlur={(e) => blurHandler(e)}
					name="phone"
					type="phone"
					placeholder="Телефон"
					minLength="6"
					required
				/>
				{emailDirty && emailError && (
					<div className="authForm__error-message">
						{emailErrorMessage}
					</div>
				)}
				<Input
					className="authForm__input"
					onChange={(e) => emailHandler(e)}
					value={email}
					onBlur={(e) => blurHandler(e)}
					name="email"
					type="email"
					placeholder="Почта"
					minLength="6"
					required
				/>
				{passwordDirty && passwordError && (
					<div className="authForm__error-message">
						{passwordErrorMessage}
					</div>
				)}
				<div className="authForm__input-password">
					<Input
						className="authForm__input authForm__passwordInput"
						onChange={(e) => passwordHandler(e)}
						value={password}
						onBlur={(e) => blurHandler(e)}
						name="password"
						type={passwordShown ? 'text' : 'password'}
						placeholder="Пароль"
						minLength="5"
						maxLength="15"
						required
					/>
					<img
						className="authForm__password-icon"
						src={passwordShown ? eye : closedEye}
						alt="button"
						onClick={togglePassword}
					/>
				</div>
				{passwordConfirmationDirty && passwordConfirmationError && (
					<div className="authForm__error-message">
						{passwordConfirmationErrorMessage}
					</div>
				)}
				<div className="authForm__input-password">
					<Input
						className="authForm__input authForm__passwordInput"
						onChange={(e) => passwordConfirmationHandler(e)}
						value={passwordConfirmation}
						onBlur={(e) => blurHandler(e)}
						name="passwordConfirmation"
						type={passwordConfirmationShown ? 'text' : 'password'}
						placeholder="Подтвердите пароль"
						minLength="5"
						maxLength="15"
						required
					/>
					<img
						className="authForm__password-icon"
						src={passwordConfirmationShown ? eye : closedEye}
						alt="button"
						onClick={togglePasswordConfirmation}
					/>
				</div>

				<div className="authForm__controls">
					<Button
						className="signup-button"
						type="submit"
						// disabled={isLoading}
						text="Зарегестрироваться"
					></Button>
					<div className="bottom-question_signUp">
						Уже есть аккаунт?{' '}
						<Link to="/login" className="miniTitle">
							Войти
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
};
export default Form;
