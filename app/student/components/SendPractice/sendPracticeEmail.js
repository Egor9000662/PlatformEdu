const emailsConfig = require('../../../modules/configs/emails.json');
import axios from 'axios';

const sendPracticeEmail = async (course, group, name, task, lesson) => {
	let recipient;

	switch (course) {
		case 'frontend':
			recipient = emailsConfig.MENTOR_FRONTEND_EMAIL;
			break;
		case 'mobile':
			recipient = emailsConfig.MENTOR_MOBILE_EMAIL;
			break;
		default:
			break;
	}

	await axios({
		method: 'post',
		url: `https://api.mailgun.net/v3/sandbox1fc6e08751044ed7924b7779207c3606.mailgun.org/messages`,
		auth: {
			username: 'Eduplatform',
			password: emailsConfig.MAIN_SENDER_APIKEY,
		},
		params: {
			from: `Eduplatform <${emailsConfig.MAIN_SENDER_EMAIL}>`,
			to: `${recipient}`,
			subject: `[${group}] Новое домашнее задание ожидает проверки`,
			text: `Студентка ${name} отправила задание ${task} к неделе ${lesson}`,
		},
		mode: 'no-cors',
	}).then(
		(response) => {
			// console.log(response);
		},
		(reject) => {
			// console.log(reject);
		}
	);
};

export default sendPracticeEmail;
