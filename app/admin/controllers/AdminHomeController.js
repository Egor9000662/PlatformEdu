export default class AdminHomeController {
	groups;
	courses;
	user;

	constructor(allGroups, allCourses, user) {
		this.groups = allGroups;
		this.courses = allCourses;
		this.user = user;
	}

	get workspaceId() {
		const userRole = this.user?.user?.userRole[0];
		return  userRole?.workspace?.id
	}

	get groups() {
		const groups = this.groups?.filter(item => item.workspace.id === this.workspaceId);
		return groups || [];
	}

	get courses() {
		const courses = this.courses?.filter(item => item.workspace.id === this.workspaceId);
		return courses || [];	}
}
