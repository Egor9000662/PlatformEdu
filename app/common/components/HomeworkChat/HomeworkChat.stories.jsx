import React from "react";

import HomeworkChat from "../../pages/HomeworkChatPage/HomeworkChatPage";

export default {
	component: HomeworkChat,
	title: "Teacher/HomeworkChat",
};

const Template = (args) => <HomeworkChat {...args} />;

export const Primary = Template.bind({});
