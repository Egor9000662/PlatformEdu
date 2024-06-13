// const emailsConfig = require("../../../modules/configs/emails.json");
// import axios from "axios";
//
// const checkedEmail = async (groupCheckInfo) => {
// 	let text = "";
// 	for (let group of groupCheckInfo) {
// 		const stdString =
// 			group.currentUnchecked % 2 === 0 ? `человека` : `человек`;
// 		const string =
// 			`В ${group.name} непроверены ${group.currentUnchecked}/${group.studentsAmount} студентов.` +
// 			`\n`;
// 		text += string;
// 	}
// 	let recipient = emailsConfig.MENTOR_MOBILE_EMAIL;
// 	await axios({
// 		method: "post",
// 		url: `https://api.mailgun.net/v3/sandbox1fc6e08751044ed7924b7779207c3606.mailgun.org/messages`,
// 		auth: {
// 			username: "Eduplatform",
// 			password: emailsConfig.MAIN_SENDER_APIKEY,
// 		},
// 		params: {
// 			from: `Eduplatform <${emailsConfig.MAIN_SENDER_EMAIL}>`,
// 			to: `${recipient}`,
// 			subject: `Сведения о проверке домашних работ `,
// 			text: `Сегодня по группам имеется следующая информация по полученным заданиям.\n${text}`,
// 		},
// 		mode: "no-cors",
// 	}).then(
// 		(response) => {
// 			// console.log(response);
// 		},
// 		(reject) => {
// 			// console.log(reject);
// 		}
// 	);
// };
//
// export default checkedEmail;
