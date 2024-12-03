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

    return res.status(200).json({
      code: ERROR_CODES.SUCCESS,
      data: userData,
    });
  } catch (error) {
    return handleCatchError(error, req, res);
  }
};


exports.updateUser = async (req, res) => {
try {
  const { userId } = req.params;
  const updates = req.body;
  const data = req.body
  const allowedUpdates = {};
  updateableFields.forEach((field) => {
    if (field in updates) {
      allowedUpdates[field] = updates[field];
    }
  });

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({
      code: ERROR_CODES.NOT_FOUND,
      message: MESSAGES.USER_NOT_FOUND,
    });
  }

  await user.update(allowedUpdates);
  const clientDoc = {
    "bmi": data.bmi,
    "bloodGroup": data.bloodGroup,
    "medicalHistory": data.medicalHistory,
    "medications": data.medications,
    "surgeries": data.surgeries,
    "height": data.height,
    "weight": data.weight,
    "physicalActivity": data.physicalActivity,
    "smoking": data.smoking,
    "drinking": data.drinking,
    "allergies": data.allergies,
    "pcod": data.pcod,
    "diabetes": data.diabetes,
    "bloodPressure": data.bloodPressure,
    "majorSurgery": data.majorSurgery
  };


  await Client.update(clientDoc, { where: { userId: userId }})

  return res.status(200).json({
    code: ERROR_CODES.SUCCESS,
    data: user,
  });
} catch (error) {
  return handleCatchError(error, req, res);
}

};


exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;    
    const userData = await User.findOne({
      where: { userRole: "Client", userId: userId },
      include: [
        {
          model: Client,
          as: "client"
        }
      ]
    });
    

    return res.status(200).json({
      code: ERROR_CODES.SUCCESS,
      data: userData,
    });
  } catch (error) {
    return handleCatchError(error, req, res);
  }
};
