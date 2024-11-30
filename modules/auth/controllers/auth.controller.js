const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');
const { ERROR_CODES, MESSAGES } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const { createToken, removeSensitiveKeys, verifyToken, formatDomain } = require("../services/auth.service");
const moment = require('moment-timezone');
const { validatePassword } = require('../services/util');
const { handleCatchError } = require('../../../utils/error.service');
const { Sequelize, where } = require('sequelize');
const User = getModel('User');
const Client = getModel('Client');
const Nutritionist = getModel('Nutritionist');
const YogaTrainer = getModel('YogaTrainer')

exports.signUp = async (req, res) => {
let transaction;
try {
    const data = req.body;
    if ( !data.firstName ) {
        return res.status(405).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Please provide firstname"
        })
    }

    if ( !data.lastName ) {
        return res.status(405).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Please provide lastName"
        })
    }

    if ( !data.userEmail ) {
        return res.status(405).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Please provide userEmail"
        })
    }

    if ( !data.userPassword ) {
        return res.status(405).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Please provide userPassword"
        })
    }

    if (!data.userRole) {
        return res.status(405).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Please provide a user role"
        });
    }
    
    const validRoles = ['Client', 'Nutritionist', 'YogaTrainer'];
    if (!validRoles.includes(data.userRole)) {
        return res.status(405).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Invalid user role. Please choose from 'Client', 'Nutritionist', or 'YogaTrainer'."
        });
    }

    transaction = await User.sequelize.transaction();
    const isUserExist = await User.findOne({ where: { userEmail: data.userEmail } });

    if (isUserExist) {
        return res.status(409).json({
            code: ERROR_CODES.ALREADY_PRESENT,
            error: "User already found"
        });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.userPassword, salt);

    const doc = {
        "firstName": data.firstName,
        "lastName": data.lastName,
        "userEmail": data.userEmail,
        "userPassword": hashedPassword,
        "userRole": data.userRole || null,
        "phoneNumber": data.phoneNumber || null,
        "address": data.address || null,
        "salt": salt,
        "age": data.age || null,
    };

    let userCreate = await User.create(doc, { transaction });
    userCreate = userCreate.get({ plain: true });
    
    if (data.userRole === "Client") {
    
        if (!data.client) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Client data is required"
            });
        }

        if (!data.client.gender) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Gender is required for Client"
            });
        }

        if (!data.client.age) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Age is required for Client"
            });
        }

        if (typeof data.client.age !== 'number' || data.client.age <= 0) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Age must be a positive number"
            });
        }

        if (data.client.gender !== "Male" && data.client.gender !== "Female" && data.client.gender !== "Other") {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Gender must be 'Male', 'Female', or 'Other'"
            });
        }

        const clientDoc = {
            userId: userCreate.userId, 
            bmi: data.client.bmi || null,
            bloodGroup: data.client.bloodGroup || null,
            medicalHistory: data.client.medicalHistory || null,
            allergies: data.client.allergies || null,
            age: data.client.age || null,
            gender: data.client.gender || null
        };

        await Client.create(clientDoc, { transaction });
    }

    if (data.userRole === "Nutritionist") {
        if (!data.nutritionist) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "nutritionist data is required"
            });
        }

        if (!data.nutritionist.specialization) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Specialization is required for Nutritionist"
            });
        }

        if (!data.nutritionist.experienceYears) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "experienceYears is required for Nutritionist"
            });
        }

        if (!data.nutritionist.age) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Age is required for Client"
            });
        }

        if (typeof data.nutritionist.age !== 'number' || data.nutritionist.age <= 0) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Age must be a positive number"
            });
        }

        if (data.nutritionist.gender !== "Male" && data.nutritionist.gender !== "Female" && data.nutritionist.gender !== "Other") {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Gender must be 'Male', 'Female', or 'Other'"
            });
        }

        const nutritionistDoc = {
            userId: userCreate.userId, 
            age: data.nutritionist.age,
            gender: data.nutritionist.gender,
            specialization: data.nutritionist.specialization,
            experienceYears: data.nutritionist.experienceYears
        };

        await Nutritionist.create(nutritionistDoc, { transaction });
    }

    if (data.userRole === "YogaTrainer") {
        if (!data.yogaTrainer) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "yogaTrainer data is required"
            });
        }

        if (!data.yogaTrainer.specialization) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Specialization is required for yogaTrainer"
            });
        }

        if (!data.yogaTrainer.experienceYears) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "experienceYears is required for yogaTrainer"
            });
        }

        if (!data.yogaTrainer.age) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Age is required for yogaTrainer"
            });
        }

        if (typeof data.yogaTrainer.age !== 'number' || data.yogaTrainer.age <= 0) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Age must be a positive number"
            });
        }

        if (data.yogaTrainer.gender !== "Male" && data.yogaTrainer.gender !== "Female" && data.yogaTrainer.gender !== "Other") {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Gender must be 'Male', 'Female', or 'Other'"
            });
        }

        const yogaTrainerDoc = {
            userId: userCreate.userId, 
            age: data.nutritionist.age,
            gender: data.nutritionist.gender,
            specialization: data.nutritionist.specialization,
            experienceYears: data.nutritionist.experienceYears
        };

        await YogaTrainer.create(yogaTrainerDoc, { transaction });
    }

    await transaction.commit();
    
    const { token, refreshToken } = await createToken({
        userId: userCreate.id,
        userRole: userCreate.userRole,
        userName: userCreate.userName,
        userEmail: userCreate.userEmail
    }, data.isLong == true ? '7d' : '1d')

    res.status(200).json({
        code: ERROR_CODES.SUCCESS,
        token: token,
        refreshToken: refreshToken,
        data: removeSensitiveKeys(userCreate)
    });    

} catch (error) {
    return handleCatchError(error, req, res)
}

}
exports.signIn = async (req, res) => {
    try {       
        const data = req.body;
        console.log(data);
        

        if (!data.userEmail) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                keys: ['userEmail']
            });
        }

        if (!data.userPassword) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                keys: ['userPassword']
            });
        }

        const findUser = await User.findOne({
            where: { userEmail: data.userEmail }
        })

        if (!findUser) {
            return res.status(405).json({
                code: ERROR_CODES.NOT_FOUND
            });
        }

        let user = JSON.parse(JSON.stringify(findUser));
        const hashedPassword = await bcrypt.hash(data.userPassword, user.salt);

        if (hashedPassword != user.userPassword) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_CREDENTIAL,
            });
        }

        if (user.isFirstLogin) {
            const resetToken = jwt.sign({ userEmail: user.userEmail }, process.env.JWT_SECRET, { expiresIn: '10m' });
            user.resetToken = resetToken;

            return res.status(200).json({
                code: ERROR_CODES.RESET_PASSWORD,
                resetToken: resetToken,
                name: user.userName
            });
        }

        const { token, refreshToken } = await createToken({
            userId: user.userId,
            userRole: user.userRole,
            userName: user.userName,
            userEmail: user.userEmail
        }, data.isLong == true ? '7d' : '1d')

        await User.update({
            lastLoginAt: moment().format()
        }, {
            where: { userId: user.userId }
        })

        res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            token: token,
            refreshToken: refreshToken,
            data: removeSensitiveKeys(user)
        });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            code: ERROR_CODES.FAILED,
            error: error.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { userEmail } = req.body;
        console.log(userEmail);
        
        const User = getModel('User');
        if (!userEmail) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Please proide email"
            })
        }
        const user = await User.findOne({ where: { userEmail } });
        if (!user) {
            return res.status(404).json({ code: ERROR_CODES.USER_NOT_FOUND, message: 'User not found' });
        }

        const resetToken = jwt.sign({ userEmail: user.userEmail }, process.env.JWT_SECRET, { expiresIn: '10m' });
        user.resetToken = resetToken;

        const frontendLink = `${req.protocol}://${req.headers.host}`;
        const resetLink = `${frontendLink}/reset-password?token=${resetToken}`;

        // const isSent = await sendEmail({
        //     toEmails: [user.email],
        //     type: 'RESET_PASSWORD',
        //     params: {
        //         name: get(user, 'firstName', 'User'),
        //         resetLink: resetLink
        //     }
        // })

        // console.log('isSent', isSent)

        res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            message: 'Password reset link sent successfully',
            resetLink: config.env == 'dev' ? resetLink : ''
        });
    } catch (error) {
        res.status(500).json({
            code: ERROR_CODES.FAILED,
            error: error.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        const User = getModel('User');

        if (!resetToken) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: 'Please provide reset token'
            });
        }

        if (!newPassword || (newPassword && !validatePassword(newPassword))) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: 'Please provide a valid password, 6-15 characters long.'
            });
        }

        const { valid, decoded, error } = verifyToken(resetToken);
        if (!valid) {
            return res.status(400).json({ code: ERROR_CODES.INVALID_PARAMS, message: 'Reset password token is expired.' });
        }
    console.log(decoded);
    
        const user = await User.findOne({ where: { userEmail: decoded.userEmail } });
        if (!user) {
            return res.status(400).json({ code: ERROR_CODES.NOT_FOUND, message: 'Account not found' });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.userPassword = hashedPassword;
        user.salt = salt;
        user.isFirstLogin = false;
        user.resetToken = null;
        await user.save();
        res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            message: 'Password reset successfully'
        });
    } catch (error) {
        res.status(500).json({
            code: ERROR_CODES.FAILED,
            error: config.env == 'dev' ? error.message : "something went wrong"
        });
    }
};