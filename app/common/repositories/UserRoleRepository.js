import {gql, useMutation} from "@apollo/client";

export const CREATE_USER_ROLE = gql`
	mutation createUserRole($userRoleCreateRequestDto: UserRoleCreateRequestDto){
      createUserRole(userRoleCreateRequestDto:$userRoleCreateRequestDto){
        id
        user{
          id
          isActive
          email
        }
        role{
          id
          name
        }
        workspace{
          id
          name
        }
        isActive
      }
    }
`
// "userRoleCreateRequestDto":{ // параметры
// 	"userId": "",
// 		"roleName": "",
// 		"workspaceId": "",
// 		"isActive": true
// }
export const useСreateUserRole = () => {
	const [createUserRole, {error: createUserRoleError}] = useMutation(CREATE_USER_ROLE);
	return [createUserRole, createUserRoleError];
}
