const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { omit } = require('lodash');
const config = require('../../../config/config');
const { getModel } = require('../../../modelManager');


const createToken = async (payload, expiresIn = '30m') => {
    let [token, refreshToken] = await Promise.all([
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn }),
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
    ]);
    return { token, refreshToken };
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, error };
    }
}

const createDefaultSuperAdmin = async () => {
    const { error, user } = await createUser({
        firstName: 'Super',
        lastName: 'Admin',
        //email: config.defaultMail,
        password: 'erp3001',
        isEmailVerified: true,
        isSuperAdmin: true
    });

    if (error && error != 'User already present') {
        console.log('error', error);
        return;
    }
   // console.log(`Super Admin: ${config.defaultMail}/erp3001`)
}

const createUser = async (user) => {
    try {

        const Users = getModel('User');
        if (Users) {
            const findUser = await Users.findOne({
                where: { userEmail: "reckitt@gmail.com" }
            })

            if (!findUser) {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash("123456", salt);
                const userDoc = {
                    "userRole": 1,
                    "supplierId": 0,
                    "userName": "reckitt",
                    "userEmail": "reckitt@gmail.com",
                    "userPassword": hashedPassword,
                    "salt": salt,
                    "isActive": false,
                    "isFirstLogin": false,
                    "lastLoginAt": null
                  }
                  
                let userResult = await Users.create(userDoc);
                 console.log(userResult);
                 
                if (!userResult) {
                    return { error: 'Failed to create', user: null };
                }
                return { error: '', user: JSON.parse(JSON.stringify(userResult)) };
            }

            return { error: 'User already present', user: null };
        }
        return { error: 'Failed to create', user: null };
    } catch (error) {
        console.error('Error creating user:', error);
        return { error: 'Failed to create', user: null };
    }
};

const removeSensitiveKeys = (obj) => {
    return omit(obj, ['userPassword', 'salt', 'token'])
}


const formatDomain = (_subdomain, host) => {
    let subdomain = host.split('.')[0];
    if (subdomain == _subdomain) {
        return host;
    }
    else {
        return `${_subdomain}.${host}`
    }
}

module.exports = {
    createToken,
    verifyToken,
    createDefaultSuperAdmin,
    createUser,
    removeSensitiveKeys,
    formatDomain
}