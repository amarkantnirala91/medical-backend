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

exports.addExercisePlan = async (req, res)=>{
    let transaction;
    try {
        const { yogaTrainerId, clientId, appointmentId } = req.params
        const data = req.body;
        if ( !data.exerciseName ) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Please provide exerciseName"
            })
        }
    
        if ( !data.duration ) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Please provide duration"
            })
        }
    
        if ( !data.planFee ) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Please provide planFee"
            })
        }


    const [findYoga, findClient, findAppointment] = await Promise.all([
        YogaTrainer.findOne({ where: {
            userId: yogaTrainerId
        }}),
        Client.findOne({ where: {
            userId: clientId
        }}),
        Appointment.findOne({ 
            where: { professionalId: yogaTrainerId}
        })   
    ])

    if ( !findYoga ) {
        return res.status(404).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "YogaTrainer not found"
        })
    }

    if ( !findClient ) {
        return res.status(404).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Client not found"
        })
    }

    
    if ( !findAppointment ) {
        return res.status(404).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Appointment not found"
        })
    }

const appointment = findAppointment.get({ plain: true })
const doc = {
    exerciseName: data.exerciseName,
    yogaTrainerId: yogaTrainerId,
    clientId: clientId,
    planFee: data.planFee,
    description: data.description || null,
    duration: data.duration || null,
    frequency: data.frequency || null,
};


transaction = await Exercise.sequelize.transaction();
await Promise.all([
    Exercise.create(doc, { transaction }),
    Appointment.update({status: "Confirmed"}, { where: { appointmentId: appointmentId }})
])

await transaction.commit();

return res.status(200).json({
    code: ERROR_CODES.SUCCESS,
    message: "DietPlan create successfull"
})
    } catch (error) {
        if (transaction) {
           await transaction.rollback()
        }
        return handleCatchError(error, req, res)
    }
}

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
           
          if (filter.yogaTrainerId) {
            whereQuery.where["yogaTrainer"] = filter.yogaTrainerId;
          }
          if (filter.clientId) {  // Corrected condition
            whereQuery.where["clientId"] = filter.clientId;
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