import React from 'react';
import './NotionPageHeader.scss';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import HomeButon from '../../../common/components/HomeButton/HomeButton';

export default function NotionPageHeader({ block }) {
	return (
		<div className="notionPage-header">
			<BackArrow />
			<HomeButon />
		</div>
	);
}
