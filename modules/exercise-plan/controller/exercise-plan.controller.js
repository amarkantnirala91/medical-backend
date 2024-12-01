const config = require('../../../config/config');
const { ERROR_CODES, MESSAGES, USER_DEFAULT_ATTRIBUTE } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const { Sequelize, where } = require('sequelize');
const { handleCatchError } = require('../../../utils/error.service');
const { parseQueryStringToObject } = require('../../../utils/util');
const moment = require('moment-timezone');
const { isInteger, includes } = require('lodash');
const User = getModel('User');
const Client = getModel('Client');
const Appointment = getModel('Appointment');
const Nutritionist = getModel('Nutritionist');
const YogaTrainer = getModel('YogaTrainer');
const DietPlan = getModel('DietPlan');
const Exercise = getModel('Exercise');

exports.addExercisePlan = async (req, res) => {
    let transaction;
    try {
        const { yogaTrainerId, clientId, appointmentId } = req.params;
        const data = req.body;

        // Fetch the necessary records
        const [findYoga, findClient, findAppointment] = await Promise.all([
            YogaTrainer.findOne({ where: { userId: yogaTrainerId } }),
            Client.findOne({ where: { userId: clientId } }),
            Appointment.findOne({ where: { appointmentId: appointmentId } })
        ]);

        if (!findYoga) {
            return res.status(404).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "YogaTrainer not found"
            });
        }

        if (!findClient) {
            return res.status(404).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Client not found"
            });
        }

        if (!findAppointment) {
            return res.status(404).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Appointment not found"
            });
        }

        const appointment = findAppointment.get({ plain: true });

        // Prepare the document for insertion
        const doc = {
            yogaTrainerId: yogaTrainerId,
            clientId: clientId,
            appointmentId: appointmentId,
            morningExercise: data.morningExercise || [],
            afternoonExercise: data.afternoonExercise || [],
            eveningExercise: data.eveningExercise || [],
            nightExercise: data.nightExercise || []
        };

       const [exercise, appointm] = await Promise.all([
            Exercise.create(doc),
            Appointment.update({ status: "Confirmed" }, { where: { appointmentId: appointmentId } })
        ]);

        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            message: "Exercise plan created successfully",
            data: exercise
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        return handleCatchError(error, req, res);
    }
};


exports.getExercisePlan = async (req, res)=>{
    try {
        const { filter = {} } = parseQueryStringToObject(req.query);
        
        const whereQuery = {
            include: [
                {
                    model: Client,
                    as: 'client',
                    required: false,
                    include: [
                        {
                            model: User,
                            as: 'user',
                            required: false,
                            attributes: USER_DEFAULT_ATTRIBUTE
                        }
                    ]
                },
                {
                    model: YogaTrainer,
                    as: 'yogaTrainer',
                    required: false,
                    include: [
                        {
                            model: User,
                            as: 'user',
                            required: false,
                            attributes: USER_DEFAULT_ATTRIBUTE
                        }
                    ]
                }
            ],
            where: {}
          };
           
          if (filter.appointmentId) { 
            whereQuery.where["appointmentId"] = filter.appointmentId;
          }
          
          
          const data = await Exercise.findAll(whereQuery)
          return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data
          })

    } catch (error) {
        return handleCatchError(error, req, res)
    }
};