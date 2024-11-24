const { where } = require("sequelize");
const { ERROR_CODES } = require("../../../config/constant");
const { getModel, include } = require("../../../modelManager");
const { handleCatchError } = require("../../../utils/error.service");
const { includes } = require("lodash");
const Category = getModel('Category');
const SubCategory = getModel('SubCategory');

exports.addCategory = async (req,res)=>{
    try {
        const { categoryName } = req.body;

        if (!categoryName) {
           return res.status(400).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Please provide category name"
           })
        }

        const category = await Category.create({categoryName});
        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data: category
        })
    } catch (error) {
        return handleCatchError(error,req,res)
    }
    
}

exports.getAllCategory = async (req,res)=>{
    try {
        const categories = await Category.findAll(
            {
                include: [
                    {
                        model: SubCategory,
                        as: "subCategories"
                    }
                ]
            }
        );
        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data: categories
        })
    } catch (error) {
        return handleCatchError(error,req,res)
    }
}

exports.updateCategory = async (req,res)=>{
    try {
        const { catId } = req.params;
        const { categoryName } =req.body;
        
        const findCatId = await Category.findOne({ where: { categoryId: catId }})
        if (!categoryName) {
            return res.status(400).json({
             code: ERROR_CODES.INVALID_PARAMS,
             error: "Please provide category name"
            })
         }

        if (!findCatId) {
            return res.status(404).json({
             code: ERROR_CODES.NOT_FOUND,
             error: "Category Id not found"
            })
         }
         const category = await Category.update({categoryName},{ where: {categoryId: catId}});
         return res.status(200).json({
             code: ERROR_CODES.SUCCESS,
             data: category
         })
    } catch (error) {
        return handleCatchError(error,req,res)
    }
}