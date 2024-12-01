const { ERROR_CODES } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const moment = require('moment-timezone');
const { handleCatchError } = require("../../../utils/error.service");
const { parseQueryStringToObject } = require("../../../utils/util");
const User = getModel('User')
exports.createSubscription = async (req, res) => {
  try {
    const data = req.body;
    if (!data.planName) {
      return res.status(405).json({
        code: ERROR_CODES.INVALID_PARAMS,
        error: "Plan name required"
      });
    }

    if (!data.userId) {
      return res.status(405).json({
        code: ERROR_CODES.INVALID_PARAMS,
        error: "User id is required"
      });
    }

    const user = await User.findOne({ where: { userId: data.userId }});
    if (!user) {
     return res.status(404).json({
        code: ERROR_CODES.NOT_FOUND,
        error: "User not found"
     })
    }

    if (!data.duration || isNaN(data.duration) || data.duration <= 0) {
      return res.status(400).json({ message: 'Duration must be a valid' });
    }
    const startDate = moment().format('YYYY-MM-DD');
    const endDate = moment(startDate).add(data.duration, 'months').format('YYYY-MM-DD');

    const calculateDuration = (startDate, endDate) => {
      const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    };

    const durationInDays = calculateDuration(startDate, endDate);
    console.log('Calculated Duration (in days):', durationInDays);
    const Subscription = getModel('Subscription');
    const doc = {
        userId: data.userId,
        planName: data.planName,
        startDate: startDate,
        endDate: endDate,
        duration: durationInDays,
        status: 'active'
      }

    const newSubscription = await Subscription.create(doc);

    return res.status(201).json({
      message: 'Subscription created successfully',
      subscription: newSubscription
    });

  } catch (error) {
    return handleCatchError(error, req, res);
  }
};

exports.getSubscriptionPlan = async (req, res)=>{
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
            whereQuery.where["yogaTrainerId"] = filter.yogaTrainerId;
          }
          if (filter.clientId) { 
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