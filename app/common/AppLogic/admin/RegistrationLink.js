import {signupPath} from "../../../App";
import SendMessageModel from "./SendMessageModel";

export default class RegistrationLink {
	#group;

	constructor(group) {
		this.#group = group;
	}

	generateLink(setLink, setIsLink) {
		//бэк предоставит метод получения токена
		const url = this.#createUrl();
		const link = `${url}&email=`
		setIsLink(true);
		setLink(link);
	}

	copyLink(link, setIsTooltip) {
		navigator.clipboard.writeText(link)
			.then(result => {
				setIsTooltip(true);
				setTimeout(() => {
					setIsTooltip(false);
				}, 1500)
			})
			.catch(error => {
					console.log('Something went wrong', error);
				}
			);
	}

	async sendPersonalLink(emailsValue) {
		const re = /[,\s]+/;
		const emails = emailsValue.split(re);
		const goodEmails = emails.filter(email => email !== '');
		const sendMessage = new SendMessageModel();
		const promises = goodEmails.map((email,i) => {
			const link = this.#createUrl(email);
			return sendMessage.send(link, email);
		});
		const results = await Promise.allSettled(promises);
		const failedEmails = results.map((result, i) => ({email: emails[i], ...result}))
			.filter(result => result.status === 'rejected')
			.map(result => result.email);
		return {failedEmails};
	}

	#createUrl(email) {
		const searchParams = new URLSearchParams({
			workspaceId: this.#group.workspace.id,
			courseId: this.#group.course.id,
			groupId: this.#group.id,
		});
		if (email) {
			searchParams.append("email", email);
		}
		return `https://eduplatform.web.app${signupPath}?${searchParams}`;
	}
}
