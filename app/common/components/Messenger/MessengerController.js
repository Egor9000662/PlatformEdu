
const filterUsers = (user, username, auth) => {
    switch (true) {
        case user.uid === auth.user.uid:
            return false;
        case auth.role === 'teacher' && user.isAnonymous:
            return false;
        case username === '':
            return true;
        case user.name.toLowerCase().includes(username?.toLowerCase()):
            return true;
        default:
            return false;
    }
};

const sortUsers = (users, chats) => {
    return users.slice().sort((a, b) => {
        const chatA = chats[a.uid];
        const chatB = chats[b.uid];

        switch (true) {
            case a.isAnonymous && !b.isAnonymous:
                return -1;
            case !a.isAnonymous && b.isAnonymous:
                return 1;
            case chatA.lastMessageDate && chatB.lastMessageDate:
                switch (true) {
                    case chatA.lastMessageDate < chatB.lastMessageDate:
                        return 1;
                    case chatA.lastMessageDate > chatB.lastMessageDate:
                        return -1;
                    default:
                        return 0;
                }
            case chatA.lastMessageDate && !chatB.lastMessageDate:
                return -1;
            case !chatA.lastMessageDate && chatB.lastMessageDate:
                return 1;
            case a.group > b.group:
                return 1;
            case b.group > a.group:
                return -1;
            default:
                return 0;
        }
    })
}

const usersFilteredByGroup = async (users, auth, getMentor, getGroup, getChatByIds, getAnonymousChatById) => {
    const chats = {};
    let groups = [];

    if (auth.role === 'teacher') {
        groups = Object.keys(getMentor(auth.user.uid).groups);
    }

    const usersFilteredByGroup = users.filter((user) => {
        if (auth.role === 'student') {
            return (user.group === auth.profile.group || user.isAnonymous);
        }
        if (auth.role === 'teacher') {
            return user.groups.some((group) => group.groupId === auth.profile.group);
        }
        return false;
    });

    if (auth.role === 'student') {
        const group = getGroup(auth.profile.group);
        Object.values(group.mentor).map((mentor) => {
            if (!mentor.isHidden) {
                usersFilteredByGroup.push(getMentor(mentor.uid));
            }
        });
    }

    for (const user of usersFilteredByGroup) {
        const ids = [auth.user.uid, user.uid];
        chats[user.uid] = await (user.isAnonymous ? getAnonymousChatById(ids) : getChatByIds(ids));
    }

    return sortUsers(usersFilteredByGroup, chats);
}

export {
    filterUsers,
    usersFilteredByGroup,
}