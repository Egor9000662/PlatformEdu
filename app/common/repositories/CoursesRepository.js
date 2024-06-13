import { gql, useQuery } from "@apollo/client";

export const GET_ALL_COURSES = gql`
	query findAllCourse{
	  courses:findAllCourse{
	    id
		name
		character{
		  id
		  name
		  isActive
		}
		workspace{
		  id
		  name
		}
		duration
	  }
	}
`

export const useLoadAllCoursesRepo = () => {
	const {data, loading:coursesLoading, error:coursesError} = useQuery(GET_ALL_COURSES);
	return {data, coursesLoading, coursesError};
}
