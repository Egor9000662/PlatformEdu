import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Modal } from 'antd';
import questionsData from '../../../../modules/questionnare.json';
import './IntroInfoModal.scss';

function IntroInfoModal({ isVisible, handleVisible, questionnaireInfo }) {
	const { questions } = questionsData;

	const handleCancel = () => {
		handleVisible(false);
	};

	const getAnswer = (value) => {
		if (typeof value === 'object') {
			return Object.values(value).toString();
		}
		return value;
	};
	return (
		<>
			<Modal
				className="stdModal"
				title={`Анкета студента`}
				open={isVisible}
				onCancel={handleCancel}
				footer={null}
			>
				<div className="introInfo">
					<div className="introInfo-block">
						<h3 className="introInfo-block__question">
							Текущий email:
						</h3>
						<p className="introInfo-block__answer">
							{' '}
							{questionnaireInfo.email}
						</p>
					</div>
					{questions.map((item) => {
						return (
							<div key={item.id} className="introInfo-block">
								<h3 className="introInfo-block__question">
									{item.title}:
								</h3>
								<p className="introInfo-block__answer">
									{getAnswer(questionnaireInfo[item.id])}
								</p>
							</div>
						);
					})}
				</div>
			</Modal>
		</>
	);
}

export default IntroInfoModal;
