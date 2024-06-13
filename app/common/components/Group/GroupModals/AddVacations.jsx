import { Form, InputNumber } from "antd";
import React from "react";

export default function AddVacations({
	blocksOfCourse,
	onChangeHolidays,
	defaultVacationsDuration,
}) {
	return (
		<div className="createGroup-modal editDates-numbers">
			<p className="stdMove-heading">Запланируйте каникулы</p>
			{blocksOfCourse.map((block) => {
				const label = `Перед блоком ${block.name}`;
				return (
					<>
						<Form.Item
							label={label}
							key={block}
							onChange={onChangeHolidays}
						>
							<InputNumber
								type='number'
								name={block}
								min="0"
								controls={false}
								className="createGroup-input _modal"
								placeholder={defaultVacationsDuration}
							/>
						</Form.Item>
					</>
				)}
			)}
		</div>
	);
}
