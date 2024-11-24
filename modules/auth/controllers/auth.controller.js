const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');
const { ERROR_CODES, MESSAGES } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const { createToken, removeSensitiveKeys, verifyToken, formatDomain } = require("../services/auth.service");
const moment = require('moment-timezone');
const { validatePassword } = require('../services/util');
exports.signIn = async (req, res) => {
    try {
        const User = getModel('User');
       
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

        // let perms = await getPermissions(user.userId);

        // let loggedDomain = user.isSuperAdmin ? 'admin' : perms.subdomain;

        // const portalDomain = getPortalLink(req, loggedDomain);

        // user = {
        //     ...user,
        //     ...perms,
        //     subdomain: loggedDomain,
        //     portalLink: portalDomain
        // };

        const { token, refreshToken } = await createToken({
            userId: user.id,
            userRole: user.userRole,
            userName: user.userName,
            userEmail: user.userEmail
        }, data.isLong == true ? '7d' : '1d')

        await User.update({
            lastLoginAt: moment().format()
        }, {
            where: { id: user.id }
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