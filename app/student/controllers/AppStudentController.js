export default class AppStudentController {
	#student;

	constructor(studentData) {
		this.#student = studentData;
	}
	onboardingActive(setOnboardingActive, setIsNew) {
		if (this.#student?.studentData.status.name === "new") {
			localStorage.setItem('onboardingTour', 'true');
			setOnboardingActive(true);
			setIsNew(true);
		}
	}

	workspaceQuestionnaireDoneOrNot(setRequiresQuestionnaire, setQuestionnaire, questionnaire) {
		for (const workspace of this.#student?.studentData?.studentWorkspaces) {
			if(workspace?.workspace.requiresQuestionnaire && !workspace?.questionnaireDone) {
				setRequiresQuestionnaire(workspace.workspace.requiresQuestionnaire);
				setQuestionnaire({...questionnaire, workspace});
				break;
			}
		}
	}

	courseQuestionnaireDoneOrNot(setRequiresQuestionnaire, setQuestionnaire, questionnaire) {
		for (const course of this.#student?.studentData.studentCourses) {
			if(course.course.requiresQuestionnaire && !course.questionnaireDone) {
				setRequiresQuestionnaire(course.course.requiresQuestionnaire);
				setQuestionnaire({...questionnaire, workspace: course});
				break;
			}
		}
	}
}
