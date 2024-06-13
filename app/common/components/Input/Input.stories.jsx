import React from 'react';

import Input from './Input';

export default {
	component: Input,
	title: 'Common/Input',
	argTypes: {
		type: {
			options: ['text', 'password', 'file'],
			control: { type: 'radio' },
		},
	},
};

const Template = (args) => <Input {...args} />;

export const Primary = Template.bind({});

Primary.args = {
	placeholder: 'Login',
	type: 'text',
};
