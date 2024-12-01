const { DataTypes } = require('sequelize');
const { ERROR_CODES, USER_DEFAULT_ATTRIBUTE } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const { handleCatchError } = require('../../../utils/error.service');
const { isInteger } = require('lodash');
const { parseQueryStringToObject } = require('../../../utils/util');
const Nutritionist = getModel('Nutritionist');
const Client = getModel('Client');
const Appointment = getModel('Appointment');
const DietPlan = getModel('DietPlan');
const User = getModel('User');

exports.addDietPlan = async (req, res) => {
    let transaction;
    try {
        const { nutritionistId, clientId, appointmentId } = req.params;
        const data = req.body;
        const [findNutrin, findClient, findAppointment] = await Promise.all([
            Nutritionist.findOne({ where: { userId: nutritionistId } }),
            Client.findOne({ where: { userId: clientId } }),
            Appointment.findOne({
                where: { professionalId: nutritionistId },
                include: [
                    { model: Client, as: 'client' },
                    { model: Nutritionist, as: 'nutritionist' }
                ]
            })
        ]);

        // Validate data presence
        if (!findNutrin) {
            return res.status(404).json({
                code: ERROR_CODES.INVALID_PARAMS,
                error: "Nutritionist not found"
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
        const doc = {
            nutritionistId: nutritionistId,
            clientId: clientId,
            appointmentId: appointmentId,
            breakfast: data.breakfast || [],
            lunch: data.lunch || [], 
            eveningSnack: data.eveningSnack || [], 
            dinner: data.dinner || [] 
        };
       const[diet, app] = await Promise.all([
            DietPlan.create(doc),
            Appointment.update({ status: "Confirmed" }, { where: { appointmentId: appointmentId } })
        ]);

        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data: diet,
            message: "DietPlan created successfully"
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback(); // Rollback in case of error
        }
        return handleCatchError(error, req, res); // Handle error
    }
};


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
          if (filter.clientId) { 
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