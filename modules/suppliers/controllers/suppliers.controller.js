const XLSX = require('xlsx'); // Import xlsx library    
const { handleCatchError } = require('../../../utils/error.service');
const { ERROR_CODES } = require('../../../config/constant');
exports.addSupplier = async (req,res)=>{

try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        code: ERROR_CODES.NOT_FOUND,
        error: "Please upload file"
      });
    }
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];  // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // Parse the sheet into JSON data
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Now `data` contains the Excel data as a JSON object (array of rows)
    console.log(data);

    return res.status(200).json({data})
    

} catch (error) {
    return handleCatchError(error, req, res)
};
    
}