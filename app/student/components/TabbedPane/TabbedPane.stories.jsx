import React from 'react';

import TabbedPane, { TabLink } from './TabbedPane';

export default {
	component: TabbedPane,
	title: 'Student/TabbedPane',
};

export const Primary = () => (
	<TabbedPane>
		<TabLink to="/" text="Совпадение роута" />
		<TabLink to="/hello" text="Роут" />
	</TabbedPane>
);
