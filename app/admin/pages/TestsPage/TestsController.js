const setLessonByTitle = (title, lessons, setLesson) => {
    const currentLesson = lessons.find((lesson) => lesson.title === title);
    setLesson(currentLesson || {});
    return currentLesson;
}

const getLessonsWithTests = (lessons) => {
    return Object.values(lessons).filter((lesson) => lesson.tasks && Object.values(lesson.tasks).some((task) => task.type === 'test'));
}

const getTestsStructured = (courseTests) => {
    return courseTests.map((test) => ({
        ...test,
        questions: Object.values(test.questions).map((question) => ({
            ...question,
            image: question.image ?
                (typeof question.image === 'string' ? [question.image] : [...Object.values(question.image)])
                : [],
            options: Object.values(question.options),
        })),
    }));
}

const validateTest = (questions, course, setCourseError, setUnsavedQuestionsError) => {
    let hasError = false;
    let unsavedQuestions = questions.some(item => item.saved === false);

    if (!course) {
        setCourseError('Выберите курс');
        hasError = true;
    } else {
        setCourseError('');
    }
    if (unsavedQuestions) {
        setUnsavedQuestionsError('У вас остались несохраненные вопросы');
        hasError = true;
    } else {
        setUnsavedQuestionsError('');
    }
    return hasError;

}

const saveTest = (questions, setQuestions, addTest, testId, lesson) => {
    const testQuestions = questions.map((question) => {
        const { saved, ...rest } = question;
        return rest;
    });
    setQuestions(testQuestions);
    addTest({
        id: testId,
        questions: testQuestions,
    }, lesson);
}

export {
    setLessonByTitle,
    getTestsStructured,
    validateTest,
    saveTest,
    getLessonsWithTests,
};