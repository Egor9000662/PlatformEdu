import React, { useState } from 'react';
import { Modal } from 'antd';
import './SkillItem.scss';
import iconBootstrap from '../../../assets/logos/bootstrap.png';
import iconReact from '../../../assets/logos/react.png';
import iconCSS from '../../../assets/logos/css3.png';
import iconHTML from '../../../assets/logos/html-5.png';
import iconNPM from '../../../assets/logos/npm.png';
import iconFigma from '../../../assets/logos/figma.png';
import iconSass from '../../../assets/logos/sass.png';
import iconGit from '../../../assets/logos/git.png';
import iconJS from '../../../assets/logos/javascript.png';
import iconTrello from '../../../assets/logos/trello.png';

export default function SkillItem({ name, content, status }) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const showModal = () => {
		if (status) {
			setIsModalOpen(true);
		}
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	function renderSwitch(name) {
		switch (name) {
			case 'HTML5':
				return iconHTML;
			case 'CSS3':
				return iconCSS;
			case 'JavaScript':
				return iconJS;

			case 'Git':
				return iconGit;
			case 'Sass':
				return iconSass;
			case 'React':
				return iconReact;
			case 'Trello':
				return iconTrello;
			case 'NPM':
				return iconNPM;
			case 'Figma':
				return iconFigma;
			case 'Bootstrap':
				return iconBootstrap;
		}
	}

	const skillClassName =
		status === 'done'
			? 'skill-inner-container skill-done'
			: status === 'inProgress'
			? 'skill-inner-container skill-wip'
			: 'skill-inner-container skill-new';

	return (
		<>
			<div className="skill-item" id={name} onClick={showModal}>
				<div className="skill-border">
					<div className={skillClassName}>
						<img
							className="skill-icon"
							src={renderSwitch(name)}
							alt={`${name}-skill`}
						/>
					</div>
				</div>
			</div>
			<Modal
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
				className="skill-content-modal"
			>
				<div className="skill-content">{content}</div>
			</Modal>
		</>
	);
}
