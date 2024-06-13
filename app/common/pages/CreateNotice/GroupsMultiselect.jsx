import {Select} from "antd";
import React from "react";
import selectCheckmark from "../../assets/controls/select_checkmark.svg";
import './CreateNotice.scss'
export default function GroupsMultiselect({
	recipients,
	handleRecipients,
	currentRecipients,
}) {
	return (
		<div className="select-container">
			<Select
				mode="multiple"
				placeholder="Выберите группу(ы)"
				onChange={handleRecipients}
				className="createNotice-select"
				value={currentRecipients}
			>
				{recipients.map((recipient) => {
					return (
						<Select.Option key={recipient} value={recipient}>
							{recipient}
						</Select.Option>
					);
				})}
			</Select>
			<img src={selectCheckmark} className="createNotice-checkMark" alt="selectCheckmark"/>
		</div>
	);
}

