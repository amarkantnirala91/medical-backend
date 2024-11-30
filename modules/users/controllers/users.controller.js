const config = require('../../../config/config');
const { ERROR_CODES, MESSAGES, USER_DEFAULT_ATTRIBUTE } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const { Sequelize, where,Op } = require('sequelize');
const { handleCatchError } = require('../../../utils/error.service');
const { parseQueryStringToObject } = require('../../../utils/util');
const User = getModel('User');
const Client = getModel('Client');
const Nutritionist = getModel('Nutritionist');
const Appointment = getModel('Appointment');
const YogaTrainer = getModel('YogaTrainer');

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
      whereQuery.where["userRole"] = "Client";
  } else {
      whereQuery.include.push(
          {
              model: YogaTrainer,
              as: "yogaTrainer"
          },
          {
              model: Nutritionist,
              as: "nutritionist"
          }
      );
      whereQuery.where["userRole"] = {
        [Op.or]: ["Nutritionist", "YogaTrainer"]
    };
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
