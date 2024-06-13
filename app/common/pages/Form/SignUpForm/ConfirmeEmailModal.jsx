import {Modal} from "antd";
import Input from "../../../components/Input/Input";
import * as PropTypes from "prop-types";
import React from "react";
import {Link} from "react-router-dom";

export default function ConfirmEmailModal(props) {
	return <Modal
		open={props.open}
		onCancel={props.onCancel}
		footer={null}
		className="signup-modal"
	>
		<form>
			<h1 className="authForm__title">Подтвердите почту</h1>
			{props.emailError && (
				<div className="authForm__error-message">
					{props.emailErrorMessage}
				</div>
			)}
			<Input
				className="authForm__input"
				onChange={props.onChange}
				value={props.value}
				name="confirmedEmail"
				type="email"
				placeholder="Почта"
				minLength="6"
				required
			/>
			<button
				className="signup-button button"
				onClick={(e)=>props.confirmMail(e)}
				disabled={props.emailError || !props.value}
			>
				{/*<Link*/}
				{/*	to="/login"*/}
				{/*	className='signup-link'*/}
				{/*>*/}
					Подтвердить
				{/*</Link>*/}
			</button>
		</form>
	</Modal>;
}

ConfirmEmailModal.propTypes = {
	open: PropTypes.bool,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func,
	emailError: PropTypes.bool,
	emailErrorMessage: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.string,
	onClick: PropTypes.func
};
