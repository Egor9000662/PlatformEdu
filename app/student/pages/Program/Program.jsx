import React from "react";
import "./Program.scss";

export default function ProgramCard({ course, avatar }) {
	const coursName = course["course-name"];

	return (
		<div className="card__box">
			<div className="card-program">
				<div className="card__header-wrap">
					<div className="card__header">{coursName}</div>
				</div>
				<div className="avatarDiv">
					<img className="card__photo" src={avatar} alt="avatar" />
				</div>
				{/* <div className="card__description">
					{skills.map((skill) => (
						<p className="teacher_skills" key={skill.toString()}>
							{skill}
						</p>
					))}
				</div> */}
			</div>
		</div>
	);
}
