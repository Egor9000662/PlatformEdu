import { gql, useQuery } from "@apollo/client";
import client from "../client";

export const WRITE_USER = gql`
  query WriteUser ($username: String!, $userId:String!, $roleId: String!, $studentId: String!) {
    currentUser(username: $username, userId:$userId, roleId: $roleId, studentId: $studentId) @client {
      username
      userId
      roleId
      studentId
    }
  }
`;

export const writeUser = (name, userId, roleId, studentId) => {
	client.writeQuery({
		query: WRITE_USER,
		data: {
			currentUser: {
				username: name,
				userId,
				roleId,
				studentId,
				__typename: 'CurrentUser',
			},
		},
	});
	localStorage.setItem('username', name);
	localStorage.setItem('roleId', roleId);
};


export const useReadUser = () => {
	const {data:currentUser, loading: readUserFromCacheLoading} = useQuery(WRITE_USER);
	if (!readUserFromCacheLoading && currentUser === undefined) {
		const currentUser= {}
		currentUser.currentUser ??={}
		currentUser.currentUser.username = localStorage.getItem('username');
		currentUser.currentUser.roleId = localStorage.getItem('roleId');
		return { currentUser, readUserFromCacheLoading };
	}
	return {currentUser, readUserFromCacheLoading};
}

