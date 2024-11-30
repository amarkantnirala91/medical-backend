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

exports.addDietPlan = async (req, res)=>{
    let transaction;
    try {
        const { nutritionistId, clientId, appointmentId } = req.params
        const data = req.body;
        if ( !data.planName ) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Please provide planName"
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

        if ( !data.totalCalories ) {
            return res.status(405).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Please provide totalCalories"
            })
        }

    const [findNutrin, findClient, findAppointment] = await Promise.all([
        Nutritionist.findOne({ where: {
            userId: nutritionistId
        }}),
        Client.findOne({ where: {
            userId: clientId
        }}),
        Appointment.findOne({ 
            where: { professionalId: nutritionistId},
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Nutritionist,
                    as: 'nutritionist'
                },
                {
                    model: Client,
                    as: 'client'
                }
            ]
        })   
    ])

    if ( !findNutrin ) {
        return res.status(404).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Nutritionist not found"
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
    planName: data.planName,
    nutritionistId: nutritionistId,
    clientId: clientId,
    description: data.description || null,
    duration: data.duration || null,
    planFee: data.planFee,
    totalCalories: data.totalCalories,
    totalGrams: data.totalGrams || null,
    protein: data.protein || null,
    carbs: data.carbs || null,
    fats: data.fats || null
}

transaction = await DietPlan.sequelize.transaction();
await Promise.all([
    DietPlan.create(doc, { transaction }),
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

exports.getDietPlan = async (req, res)=>{
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
                    model: Nutritionist,
                    as: 'nutritionist',
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
           
          if (filter.nutritionistId) {
            whereQuery.where["nutritionistId"] = filter.nutritionistId;
          }
          if (filter.clientId) {  // Corrected condition
            whereQuery.where["clientId"] = filter.clientId;
          }
          
          
          const data = await DietPlan.findAll(whereQuery)
          return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data
          })

    } catch (error) {
        return handleCatchError(error, req, res)
    }
};