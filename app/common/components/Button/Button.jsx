import React from "react";
import PropTypes from "prop-types";
import "./Button.scss";

export default function Button({
	text,
	variant,
	type,
	onClick,
	className,
	...props
}) {
	return (
		<button
			type={type}
			className={`${variant} ${className}`}
			onClick={onClick}
			{...props}
		>
			{text}
		</button>
	);
}

Button.defaultProps = {
	variant: "primary",
	type: "button",
};

Button.propTypes = {
	text: PropTypes.string.isRequired,
	variant: PropTypes.oneOf(["primary", "secondary", "login-form-button"]),
	type: PropTypes.oneOf(["button", "submit", "reset"]),
	onClick: PropTypes.func,
};
