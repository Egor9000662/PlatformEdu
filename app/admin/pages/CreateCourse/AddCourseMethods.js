const getLessons = (modules) => {
    let lessonsData = {}
    let counter = 1;
    modules.forEach(item => {
        item.lessons.forEach((lesson) => {
            let tasks = [];
            ["practice", "theme", "test", "links", "soft-skills"].map(key => {
                if (lesson[key]) {
                    lesson[key].forEach(link => {
                        tasks.push({
                            content: link,
                            type: key,
                        })
                    })
                }
            })

            lessonsData[`lesson-${counter}`] = {
                ...lesson,
                block: item.name,
                lessonNumber: counter,
                tasks: tasks,
            };
            delete lessonsData[`lesson-${counter}`].saved;
            delete lessonsData[`lesson-${counter}`].practice;
            delete lessonsData[`lesson-${counter}`].theme;
            delete lessonsData[`lesson-${counter}`].test;
            delete lessonsData[`lesson-${counter}`].links;
            delete lessonsData[`lesson-${counter}`]["soft-skills"];
            counter++;
        })
    });

    return lessonsData;
}

const createCourse = (modules, courseDescription) => {
    let modulesData = {}
    modules.forEach(item => {
        modulesData[item.name] = {
            id: item.name,
            duration: item.duration,
        };
    })

    const lessons = getLessons(modules);
    const course = {
        description: courseDescription,
        blocks: modulesData,
        lessons: lessons,
    }
    return course;
}

export { createCourse };    