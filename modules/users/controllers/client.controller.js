const { ERROR_CODES } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const { handleCatchError } = require("../../../utils/error.service");
const User = getModel('User');
const Client = getModel('Client');

exports.createClient = async (req, res)=>{
    try {
        const { userId } = req.params;
        const data = req.body

        
        const user = await User.findOne({ where: { userId: userId, userRole: 'Client'}});

        if (!user) {
            return res.status(200).json({
                code: ERROR_CODES.NOT_FOUND,
                error: "User Not Found"
            })
        }
        const clientDoc = {
            userId: userId,
            bmi: data.bmi || null,
            bloodGroup: data.bloodGroup || null,
            medicalHistory: data.medicalHistory || null,
            allergies: data.allergies || null,
            medications: data.medications || null,
            surgeries: data.surgeries || null,
            height: data.height || null,
            weight: data.weight || null,
            physicalActivity: data.physicalActivity || null,
            smoking: data.smoking || false,
            drinking: data.drinking || false,
            pcod: data.pcod || false,
            diabetes: data.diabetes || false,
            bloodPressure: data.bloodPressure || false,
            majorSurgery: data.majorSurgery || null,
            gender: data.gender || 'Other',
        };
        console.log(clientDoc);
        
 
        const client = await Client.create(clientDoc);
        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data: client
        })
    } catch (error) {
        return handleCatchError(error, req, res) 
    }
}