import { loginRepository, signUpRepository, signUpByLinkRepository, signUpStudentRepository } from "../../repositories/AuthRepository";
import client from "../client";
import { HttpLink } from '@apollo/client';

export const signUpService = async (name, username, email, password, phone) => {
	const userData = {
		name,
		username: email,
		password,
		phone,
		email,
		active: true
	}
	const { token, userId } = await signUpRepository(userData);
	if (token !== undefined) {
		client.link.options.headers.Authorization = `Bearer ${token}`;
		localStorage.setItem('token', `${token}`);
	}
	return { token, userId };
}

export const signUpByLinkService = async (firstName, surname, email, password, phone, groupId, courseId, workspaceId) => {
	const userData = {
		firstName,
		surname,
		email,
		username: email,
		phone,
		password,
		studentGroupCreateRequestDto: {
			groupId,
			courseId,
			status: "new",
			workspaceId
		}
	}
	const { token, userId, roleId, studentId } = await signUpByLinkRepository(userData);
	if (token !== undefined) {
		const newLink = new HttpLink({
			uri: 'http://84.201.138.176:8083/graphql?path=/graphql',
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		client.setLink(newLink);
		localStorage.setItem('token', `${token}`);
	}
	return { token, userId, roleId, studentId };
}

export const signUpStudentService = async (firstName, surname, email, password, phone) => {
	const userData = {
		firstName,
		surname,
		email,
		username: email,
		phone,
		password,
	}
	const { token, userId, roleId } = await signUpStudentRepository(userData);
	if (token !== undefined) {
		const newLink = new HttpLink({
			uri: 'http://84.201.138.176:8083/graphql?path=/graphql',
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		client.setLink(newLink);
		localStorage.setItem('token', `${token}`);
	}
	return { token, userId, roleId };
}


export const loginService = async (username, password) => {
	const userData = {
		username,
		password,
	}
	const { token, userId, roleId, studentId } = await loginRepository(userData);
	if (token !== undefined) {
		const newLink = new HttpLink({
			uri: 'http://84.201.138.176:8083/graphql?path=/graphql',
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		client.setLink(newLink);
		localStorage.setItem('token', `${token}`);
	}
	return { token, userId, roleId, studentId };
}
