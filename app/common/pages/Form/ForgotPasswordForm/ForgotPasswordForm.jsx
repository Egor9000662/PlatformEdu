import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import Input from '../../../components/Input/Input';
import './ForgotPasswordForm.scss';
import Background from '../../../../assets/images/background-desktop.jpg';
import BackArrow from '../../../components/BackArrow/BackArrow.jsx';
import FormsModel from '../../../models/FormsModel';

const ForgotPasswordForm = ({ resetPassword, formsModel }) => {
	const [email, setEmail] = useState('');
	const [emailDirty, setEmailDirty] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState(
		'Email не может быть пустым'
	);
	const [isLoading, setLoading] = useState(false);
	const history = useHistory();

	async function submitHandler(e) {
		e.preventDefault();
		const result = await resetPassword(email);
		if (result.success) {
			history.push('/login');
		} else {
			setEmailError(true);
			setEmailErrorMessage(result.message);
		}
	}

	const emailHandler = (e) => {
		setEmail(e.target.value.trim());
		const errors = formsModel.validateEmail(e.target.value);
		if (errors !== '') {
			setEmailError(true);
			setEmailErrorMessage(errors);
		} else {
			setEmailError(false);
		}
	};

	const blurHandler = (e) => {
		setEmailDirty(true);
	};

	return (
		<div
			className="authFormWrapper forgotPasswordWrapper"
			style={{
				background: `url(${Background})`,
				backgroundSize: 'cover',
			}}
		>
			<div className="forgotPassword-header">
				{' '}
				<BackArrow pathName="/login" />
			</div>
			<form className="authForm" onSubmit={submitHandler}>
				<h2 className="authForm__title">Забыли пароль</h2>
				<span className="authForm__text">
					Введите email, который вы использовали при регистрации
				</span>
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
					name="forgotten-email"
					type="email"
					placeholder="Почта"
					minLength="6"
					required
				/>

				<div className="authForm__controls ">
					{/* <Link
						to="/login"
						className="authForm__text"
						disabled={emailDirty}
					> */}
					<button
						className="authForm__button"
						type="submit"
						disabled={isLoading}
					>
						Запросить пароль
					</button>
					{/* </Link> */}
				</div>
			</form>
		</div>
	);
};

export default inject(({ auth }) => {
	const { resetPassword } = auth;
	const formsModel = new FormsModel(auth);
	return {
		resetPassword,
		formsModel,
	};
})(observer(ForgotPasswordForm));
