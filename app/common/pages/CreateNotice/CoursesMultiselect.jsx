import {Select} from "antd";
import React from "react";
import selectCheckmark from "../../assets/controls/select_checkmark.svg";
import './CreateNotice.scss';

export default function CoursesMultiselect({
	courses,
	handleCourse,
	currentCourses,
}) {
	return (
		<div className="select-container">
			<Select
				mode="multiple"
				placeholder="Выберите курс(ы)"
				onChange={handleCourse}
				className="createNotice-select"
				value={currentCourses}
			>
				{courses.map((course) => {
					return (
						<Select.Option key={course.id} value={course.id}>
							{course.id}
						</Select.Option>
					);
				})}
			</Select>
			<img src={selectCheckmark} className="createNotice-checkMark" alt="selectCheckmark"/>
		</div>
    );
}
