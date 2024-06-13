import React from "react";
import { Divider } from "antd";
import "./Lessons.scss";

export default function Lessons() {
	return (
		<div className="lessonsWrapper">
			<Divider orientation="center" style={{ border: "#E9B0F3" }}>
				<span style={{ color: "#E9B0F3", fontWeight: "600" }}>
					Уроки
				</span>
			</Divider>
			<h3 style={{ color: "#fff" }}>Тут будут какие-то уроки</h3>
		</div>
	);
}
