const { get } = require("lodash");
const { MESSAGES, ERROR_CODES } = require("../config/constant");
const config = require("../config/config");

module.exports.handleCatchError = (error, req, res) => {
    res.status(500).json({
        code: ERROR_CODES.FAILED,
        error: this.getErrorMessage(error, req)
    });
}

module.exports.getErrorMessage = (error, req) => {
    console.log('handleCatchError: get error message:', error);
    let message = MESSAGES.SOMETHING_WENT_WRONG;

    if (get(req, 'method', '').toLowerCase() == 'delete' && error.name === 'SequelizeForeignKeyConstraintError') {
        message = `Cannot delete record due to child elements are present`
    } else if (get(req, 'method', '').toLowerCase() == 'post' && error.name === 'SequelizeUniqueConstraintError') {
        message = `Duplicate record found`
    }
    else if (error.message.indexOf('cannot be null') > -1) {
        const match = error.message.match(/Column '(.+?)' cannot be null/);
        if (match) {
            message = `Please provide valid ${match[1]}`;
        }
        else {
            message = error.message;
        }
    }
    else {
        message = config.env == 'dev' ? error.message : MESSAGES.SOMETHING_WENT_WRONG
    }
    return message;
} 