import { gql, useQuery } from "@apollo/client";
import client from "../apollo/client";

export const GET_USER_BY_ID = gql`
query findByIdUserRole($id: ID!) {
	user: findByIdUserRole(id: $id) {
		role {
		  name
		}
		user {
		  id
		}
	  }
  }
`

export const useLoadByRoleIdUserRepo = (id) => {
	const { data: role, loading, error } = useQuery(GET_USER_BY_ID, {
		variables: { id },
		skip: !id,
	});
	return { data: role, loading, error }
}


export const GET_BY_ID_USER = gql`
    query findByIdUser($id:ID!){
      user: findByIdUser(id: $id) {
		id
		userRole{
		  id
		  role{
			name
		  }
		  workspace{
			id
			name
		  }
		}
      }
    }
`;

export const GET_BY_NAME_USER = gql`
  query findByNameUser($username:String!){
    user: findByNameUser(username: $username) {
      id
      firstName
      surname
      isActive
    }
  }
`;

// export const GET_BY_EMAIL_USER_ROLE = gql`
// query findByEmailUser($email: String!) {
// 	user: findByEmailUser(email: $email) {
// 	  userRole {
// 		role {
// 		  name
// 		}
// 	  }
// 	  id
// 	  isActive
// 	}
//   }
// `

export const useLoadByIdUser = (id) => {
	const { data, loading: userLoading, error: userError } = useQuery(GET_BY_ID_USER, {
		variables: { id },
		skip: !id,
	});
	return { data, userLoading, userError };
}

// export const loadNewUserRepo = async (name) => {
// 	const { result } = await client.query({
// 		query: GET_NEW_USER_DATA,
// 		variables: {
// 			username: name
// 		}
// 	  }
// 	}
// `

export const GET_BY_EMAIL_USER_ROLE = gql`
query findByEmailUser($email: String!) {
	user: findByEmailUser(email: $email) {
	  userRole {
		role {
		  name
		}
	  }
	  id
	  isActive
	}
  }
`

export const useLoadByEmailUserRepo = (email) => {
	const { data: user, loading, error } = useQuery(GET_BY_EMAIL_USER_ROLE, {
		variables: { email },
		skip: !email,
	});
	return { data: user, loading, error }
}

export const loadNewUserRepo = async (name) => {
	const { result } = await client.query({
		query: GET_BY_NAME_USER,
		variables: {
			username: name
		}
	})
	console.log(result);
	return { result };
}

export const useGetByNameUserRepo = (name) => {
	const { data, loading:userLoading, error } = useQuery(GET_BY_NAME_USER,{
		variables: {
			username: name
		},
		skip: !name,
	})
	return {data, userLoading, error};
}
