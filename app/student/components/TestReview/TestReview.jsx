import React from "react";
import "./TestReview.scss";
import Button from "../../../common/components/Button/Button";

export default function TestReview() {
	return (
		<div className="test-review-card">
			<div className="trv-card__header-wrap">
				<div className="trv-card__header">
					{/* <div style={{ padding: '2rem 0'}}> */}
					Тебе что-то не понравилось? <br /> Что вызвало трудности?
					{/* </div> */}
				</div>
			</div>
			<div className="trv-card__description">
				<textarea
					className="trv-textarea"
					rows="8"
					cols="25"
					placeholder="Твой отзыв"
				/>
				<Button className="purpleBtn" type="submit" text="Отправить" />
			</div>
		</div>
	);
}
