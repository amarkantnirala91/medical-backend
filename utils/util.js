module.exports.parseQueryStringToObject = (query) => {
    if (Object.keys(query).length == 0) {
        return {
            limit: 100,
            page: 1,
            search: null,
            include: {},
        };
    }

    const params = new URLSearchParams(query);
    const result = {};

    // Iterate over the search parameters
    for (const [key, value] of params.entries()) {
        const keys = key.split('.');

        keys.reduce((acc, k, index) => {
            if (index === keys.length - 1) {
                acc[k] = value;
            } else {
                acc[k] = acc[k] || {};
            }
            return acc[k];
        }, result);
    }

    console.log('result', result)

    return result;
};