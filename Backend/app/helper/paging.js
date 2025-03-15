exports.ParseAndPaginateUsers = (users, limit, page) => {
    if (limit <= 0 || page <= 0) {
        resizeBy.status(500).json({
            message: "Invalid pagination parameters",
        })
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = users.slice(startIndex, endIndex);
    return paginatedUsers
}