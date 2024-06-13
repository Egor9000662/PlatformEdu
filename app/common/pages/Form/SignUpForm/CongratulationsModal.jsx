import {Modal} from "antd";
import * as PropTypes from "prop-types";
import React from "react";

export default function CongratulationsModal(props) {
	return <Modal
		open={props.open}
		onCancel={props.onCancel}
		footer={null}
		className="signup-modal"
	>
		<p className="congratulations-text">
			Поздравляем, регистрация прошла успешно!<br/>
			На вашу почту отправлено письмо с ссылкой на личный кабинет.
		</p>
	</Modal>;
}

CongratulationsModal.propTypes = {
	open: PropTypes.bool,
	onCancel: PropTypes.func
};
