const config = require('../../../config/config');
const { ERROR_CODES, MESSAGES, USER_DEFAULT_ATTRIBUTE } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const { Sequelize, where, Op  } = require('sequelize');
const { handleCatchError } = require('../../../utils/error.service');
const { parseQueryStringToObject } = require('../../../utils/util');
const moment = require('moment-timezone');
const { isInteger, includes } = require('lodash');
const User = getModel('User');
const Client = getModel('Client');
const Nutritionist = getModel('Client');
const Appointment = getModel('Appointment');

exports.bookAppointment = async (req,res)=>{
    try {
        const data = req.body;
        if (!data.clientId) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "ClientId is required"
            });
        }

        if (!data.professionalId) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "professionalId is required "
            });
        }

        if (!data.appointmentDate || !moment(data.appointmentDate) ) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Please provide appointment date"
            });
        }

        if (!data.appointmentFee || !Number.isInteger(data.appointmentFee) || data.appointmentFee < 0) {
            return res.status(400).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "appointmentFee is required"
            });
        }

        const [findClient, findProfessional] = await Promise.all([
            User.findOne({
                where: {
                    userId: data.clientId,
                    userRole: 'Client',
                },
            }),
            User.findOne({
                where: {
                    userId: data.professionalId,
                    userRole: {
                        [Op.or]: ['Nutritionist', 'YogaTrainer'],
                    },
                },
            }),
        ]);
        
        // Handle if Client not found
        if (!findClient) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Client not found",
            });
        }
        
        // Handle if Professional not found
        if (!findProfessional) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Professional not found (either Nutritionist or YogaTrainer)",
            });
        }

        const doc = {
            clientId: data.clientId,
            professionalId: data.professionalId,
            appointmentDate: data.appointmentDate || Date.now(),
            appointmentFee: data.appointmentFee, 
        }

        const appointmentCreate = await Appointment.create(doc);
        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data: appointmentCreate
        })
        
    } catch (error) {
        return handleCatchError(error, req, res)
    }
}

exports.getAppointment = async (req,res)=>{
    try {
        const appointments = await Appointment.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: USER_DEFAULT_ATTRIBUTE
                }
            ]
        })

        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data: appointments
        })
    } catch (error) {
        return handleCatchError(error, req, res)
    }
}

exports.getAppointmentById = async (req,res)=>{
    try {
        const { appointmentId } = req.params
        const appointments = await Appointment.findOne({
            where: { appointmentId: appointmentId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: USER_DEFAULT_ATTRIBUTE
                }
            ]
        })

        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data: appointments
        })
    } catch (error) {
        return handleCatchError(error, req, res)
    }
}