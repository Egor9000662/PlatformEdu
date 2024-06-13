import {gql, useQuery} from "@apollo/client";

export const GET_BY_ID_LESSON = gql`
	query findByIdLesson($id:ID!){
	  currentLesson:findByIdLesson(id:$id){
		id
		name
		description
		duration
		title
		lessonNumber
	  }
	}
`

export const useGetByIdLesson = (lessonId) => {
	const { data, loading: lessonLoading, error: lessonError } = useQuery(GET_BY_ID_LESSON, {
		variables: {
			id:lessonId
		},
		skip: !lessonId
	})
	return { data, lessonLoading, lessonError };
}
