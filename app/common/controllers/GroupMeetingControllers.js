export default class GroupMeetingControllers {
	#role;

	constructor(role) {
		this.#role = role;
	}

	get adminOrTeacher() {
		return this.#role.user.role.name === "ADMIN" || this.#role.user.role.name === "TEACHER";
	}
}
