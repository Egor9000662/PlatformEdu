import { gql, useQuery } from "@apollo/client";

export const GET_ALL_MENTORS = gql`
   query findAllMentor{
     mentors: findAllMentor{
        id
        workspace{
          id
          name
        }
        user{
          id
          isActive
          userRole{
            isActive
            id
            role {
              name
            }
          }
        }
        mentorName
        specialization
        companies
        education
        experience
        blockedGroups
     }
   }
`

export const useLoadAllMentorRepo = () => {
	const {data, loading:mentorsLoading, error: mentorsError} = useQuery(GET_ALL_MENTORS);
	return {data, mentorsLoading, mentorsError};
}
