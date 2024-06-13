import * as emailjs from "@emailjs/browser";
const config = require('../../../modules/configs/emails.json');

export default class SendMessageModel {

	#createMessage(link, email) {
		return  {
				from_email: 'gamifyplatform@yandex.ru',
				to_name: "",
				to_email:email,
				subject:"gamifyplatform",
				message:`Твоя ссылка для регистрации ${link}`,
			}
	}

	async send(link, email) {
		const message = this.#createMessage(link, email);
		return emailjs.send(config.JS_SERVICE_ID, config.JS_TEMPLATE_ID, message, config.JS_PUBLIC_KEY);
	}
}
