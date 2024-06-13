const extraCourse = [{
    "id": "971df95d-924b-47bd-8f59-1613a17d9ba3",
    "name": "Frontend 3.0",
    "duration": 13,
    "blocks": [
        {
            "id": "18044032-31e9-47ce-9e1e-d3207d815781",
            "name": "Block",
            "course": {
                "id": "971df95d-924b-47bd-8f59-1613a17d9ba3"
            },
            "lessons": [
                {
                    "name": "Введение",
                    "description": "Знакомимся",
                    "title": "some title",
                    "weekNumber": 1
                }
            ]
        },
        {
            "id": "18044032-31e9-47ce-9e1e-d3207d815782",
            "name": "Block 2",
            "course": {
                "id": "971df95d-924b-47bd-8f59-1613a17d9ba3"
            },
            "lessons": [
                {
                    "name": "Урок 1",
                    "description": "Знакомимся c Block 2",
                    "title": "Block 2.1 title",
                    "weekNumber": 1
                },
                {
                    "name": "Урок 2",
                    "description": "Block 2",
                    "title": "Block 2.2 title",
                    "weekNumber": 2
                }
            ]
        }
    ]
}]

const today = new Date().setDate(new Date().getDate());
const interval = 7;

const getBlockStartDate = (blockName, group) => {
    return group?.schedules
        .filter((item) => item.lesson.block.name === blockName)
        .map((item) => new Date(item.dateStart.split('T')[0]).getTime())
        .sort((a, b) => a - b)[0];
};

export const getStudentCoursesData = (studentData) => {
    const courses = studentData.courses;
    const coursesList = [...courses]
    return coursesList;
}

export const getCurrentCourseBlocks = (currentCourse, blockIcons, group) => {
    const blocks = currentCourse.blocks;

    return blocks
        .map((block, index) => ({
            blockId: block.id,
            name: block.name,
            icon: blockIcons[index % blockIcons.length],
			unblocked: getBlockStartDate(block.name, group) < today,
            lessonsAmount: block.lessons.length,
        }))
}

export const getCurrentLessonOfBlock = (block, group) => {
	const blockLessons = group.schedules.filter(item => item.lesson.block.name === block.name);
	const sortedLessons = blockLessons.sort((a, b) => a.lesson.lessonNumber - b.lesson.lessonNumber);
	const firstBlockLesson = sortedLessons[0];
	const blockDateStart = new Date(firstBlockLesson.dateStart.split('T')[0]).getTime();
    const passedDays = today - blockDateStart;
    const currentLesson = Math.ceil(passedDays / (interval * 24 * 60 * 60 * 1000));

    if (currentLesson >= block.lessonsAmount) {
        return block.lessonsAmount;
    }
    if (currentLesson < block.lessonsAmount && block.unblocked) {
        return currentLesson;
    }
    return 0;
}
