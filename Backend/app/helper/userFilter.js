exports.filterUsersName = (users, filterName) => {
    if (!filterName) {
        return users;
    }

    const lowercasefilterName = filterName.toLowerCase();
    return users.filter(user => user.username.toLowerCase().includes(lowercasefilterName));
};

exports.filterUserId = (users, filterId) => {
    if (!filterId) {
        return users;
    }

    const parseId = parseInt(filterId);
    return users.filter(user => user.id === parseId)
};