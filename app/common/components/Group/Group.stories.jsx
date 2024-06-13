import React from 'react';

import Group from './Group';

export default {
	component: Group,
	title: 'Admin/Group',
};

const Template = (args) => <Group {...args} />;

export const Primary = Template.bind({});
