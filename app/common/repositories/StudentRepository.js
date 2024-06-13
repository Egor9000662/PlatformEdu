import { gql, useMutation, useQuery } from "@apollo/client";
import client from "../apollo/client";

export const GET_STUDENT_DATA_BY_USER_ID = gql`
	query findByUserIdStudent($userId: ID!) {
	  studentData: findByUserIdStudent(userId: $userId) {
		id
		user{
		  id
		  firstName
		  isActive
		}
		hardSkill
		softSkill
		status{
		  name
		}
		paymentDone
		courses {
		  id
		  name
		  duration
		  requiresQuestionnaire
		  isProfession
		  workspace{
			id
			name
		  }
		  blocks {
			id
			name
			lessons {
			  id
			  name
			  description
			  title
			  lessonNumber
			}
		  }
		}
		groups {
		  id
		  name
		  startDate
		  endDate
		  course {
			id
			name
		  }
		  mentors {
			id
			mentorName
			specialization
			companies
			education
			experience
			user {
			  firstName
			  surname
			}
		  }
		}
		studentCourses{
		  id
		  course{
			requiresQuestionnaire
			questionnaire{
			  id
			  questionList
			}
		  }
		  questionnaireDone
		  questionnaireAnswer
		  workspace{
			id
			name
			requiresQuestionnaire
			questionnaire{
			  id
			  questionList
			}
		  }
		}
		studentWorkspaces{
		  id
		  questionnaireDone
		  questionnaireAnswer
		  workspace{
			id
			name
			requiresQuestionnaire
			questionnaire {
			  id
			  questionList
			}
		  }
		}
	  }
	}
`
export const UPDATE_STUDENT = gql`
  mutation updateStudent ($studentBaseRequestDto: StudentBaseRequestDto){
    updateStudent: updateStudent(studentBaseRequestDto: $studentBaseRequestDto){
      id
      status{
        name
      }
      user{
        id
        firstName
        isActive
      }
      courses{
        name
        id
      }
    }
  }
`

export const FILL_QUESTIONNAIRE_COURSE = gql`
  mutation fillQuestionnaireCourse ($questionnaireId: ID!, $studentId: ID!, $answer: String!){
    fillQuestionnaireCourse(questionnaireId: $questionnaireId, studentId: $studentId, answer: $answer){
        id
		student{
		  id
		}
		course{
		  id
		  name
		}
		questionnaireDone
		questionnaireAnswer
		workspace{
		  id
		  name
		}
    }
  }
`
export const FILL_QUESTIONNAIRE_WORKSPACE = gql`
  mutation fillQuestionnaireWorkspace ($questionnaireId: ID!, $studentId: ID!, $answer: String!){
    fillQuestionnaireWorkspace(questionnaireId: $questionnaireId, studentId: $studentId, answer: $answer){
        id
		student{
		  id
		}
		workspace{
		  id
		  name
		}
		questionnaireDone
		questionnaireAnswer
    }
  }
`

export const useLoadStudentRepo = (userId) => {
  const { data: studentData, loading, error } = useQuery(GET_STUDENT_DATA_BY_USER_ID, {
    variables: {
      userId: userId
    },
    skip: !userId,
  });

  return { data: studentData, loading, error }
}

export const useUpdateStudentStatusRepo = () => {
	const [updateStudent, { data, loading, error: updateStudentStatusError}] = useMutation(UPDATE_STUDENT);
	return [updateStudent, data, loading, updateStudentStatusError];
}

export const useUpdateStudentCourseRepo = () => {
	const [fillQuestionnaireCourse, { data, error: updateStudentCourseError}] = useMutation(FILL_QUESTIONNAIRE_COURSE);
	return [fillQuestionnaireCourse, updateStudentCourseError];
}

export const useUpdateStudentWorkspaceRepo = () => {
	const [fillQuestionnaireWorkspace, { error: fillQuestionnaireWorkspaceError}] = useMutation(FILL_QUESTIONNAIRE_WORKSPACE);
	return [fillQuestionnaireWorkspace, fillQuestionnaireWorkspaceError];
}
