module.exports.validatePassword = (password) => {
    const passwordRegex = /^[A-Za-z\d@$!%*?&]{6,15}$/;
    return passwordRegex.test(password);
};