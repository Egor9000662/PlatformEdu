
export const signUpRepository = async (data) => {
	try {
		const response = await fetch("http://84.201.138.176:8083/api/v1/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		console.log("Success:", result);
		return {
			token: result.token,
			userId: result.userId,
			roleId: result.userRoleId,
			studentId:result.studentId
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

export const signUpByLinkRepository = async (data) => {
	try {
		const response = await fetch("http://84.201.138.176:8083/api/v1/auth/registerStudentByLink", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		console.log("Success:", result);
		return {
			token: result.token,
			userId: result.userId,
			roleId: result.userRoleId,
			studentId:result.studentId
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

export const signUpStudentRepository = async (data) => {
	try {
		const response = await fetch("http://localhost:8080/api/v1/auth/registerStudent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		console.log("Success:", result);
		return {
			token: result.token,
			userId: result.userId,
			roleId: result.userRoleId,
			studentId:result.studentId
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

export const loginRepository = async (data) => {
	try {
		const response = await fetch("http://84.201.138.176:8083/api/v1/auth/authenticate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		console.log("Success:", result);
		return {
			token: result.token,
			userId: result.userId,
			roleId: result.userRoleId,
			studentId:result.studentId
		}
	} catch (error) {
		console.error("Error:", error);
	}
}
