import React from 'react';

import NotionCard from './NotionCard';
import recordMap1 from './mocks/1.json';
import recordMap2 from './mocks/2.json';

export default {
	component: NotionCard,
	title: 'Student/NotionCard',
};

const Template = (args) => <NotionCard {...args} />;

export const Page = Template.bind({});
Page.args = {
	recordMap: recordMap1,
};

export const TableItem = Template.bind({});
TableItem.args = {
	recordMap: recordMap2,
};
