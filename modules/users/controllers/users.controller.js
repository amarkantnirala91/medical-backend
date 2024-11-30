const config = require('../../../config/config');
const { ERROR_CODES, MESSAGES, USER_DEFAULT_ATTRIBUTE } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const { Sequelize, where } = require('sequelize');
const { handleCatchError } = require('../../../utils/error.service');
const { parseQueryStringToObject } = require('../../../utils/util');
const User = getModel('User');
const Client = getModel('Client');
const Nutritionist = getModel('Nutritionist');
const Appointment = getModel('Appointment');

exports.getAllUser = async (req, res) => {
  try {
    const { include = {} } = parseQueryStringToObject(req.query);

    const whereQuery = {
      attributes: USER_DEFAULT_ATTRIBUTE,
      include: [],
      where: {}
    };

    // Include related Client model if requested
    if (include.role === "client") {
      whereQuery.include.push({
        model: Client,
        as: "client", 
      });
      whereQuery.where["userRole"] = "Client"
    }

    if (include.role === "nutritionist") {
      whereQuery.include.push({
        model: Nutritionist,
        as: "nutritionist",
        include: [
          {
            model: Appointment,
            as: "appointments",
            required: false,
            include: [
              {
                model: Client,
                as: "client",
                required: false,
                include: [
                  {
                    model: User,
                    as: "user",
                    required: false,
                    attributes: USER_DEFAULT_ATTRIBUTE

                  }
                ]
              }
            ]
          }
        ] 
      });
      whereQuery.where["userRole"] = "Nutritionist"
    }
    const userData = await User.findAll(whereQuery);

    // Send response
    return res.status(200).json({
      code: ERROR_CODES.SUCCESS,
      data: userData,
    });
  } catch (error) {
    return handleCatchError(error, req, res);
  }
};
