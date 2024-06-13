import {useLoadAllCoursesRepo} from "../../repositories/CoursesRepository";

export const useLoadAllCourseService = (workspaceID) => {
	const {data, coursesLoading, coursesError} = useLoadAllCoursesRepo();
	return {data, coursesLoading, coursesError};
}
