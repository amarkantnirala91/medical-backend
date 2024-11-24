const { where } = require("sequelize");
const { ERROR_CODES } = require("../../../config/constant");
const { getModel } = require("../../../modelManager");
const { handleCatchError } = require("../../../utils/error.service");
const Category = getModel('Category')
const SubCategory = getModel('SubCategory');

exports.addSubCategory = async (req,res)=>{
    try {
        const { subCategoryName, categoryId } = req.body;
        
        if (!subCategoryName) {
           return res.status(400).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Please provide sub-category name",
            key: "subCategoryName"
           })
        }

             
        if (!categoryId) {
            return res.status(400).json({
             code: ERROR_CODES.INVALID_PARAMS,
             error: "Please provide categoryId",
             key: "categoryId"
            })
         }

         const findCatId = await Category.findOne({ where: { categoryId }});
              
        if (!findCatId) {
            return res.status(404).json({
             code: ERROR_CODES.NOT_FOUND,
             error: "Category not found",
             key: "categoryId"
            })
         }

        const doc = {
            subCategoryName,
            categoryId
        } 

        const createSubCategory = await SubCategory.create(doc);
        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data: createSubCategory
        })

    } catch (error) {
        return handleCatchError(error, req, res)
    }
    
}

exports.updateSubCategory = async (req,res)=>{
    try {
        const { subCatId } = req.params
        const { subCategoryName, categoryId } = req.body;
        
        if (!subCategoryName) {
           return res.status(400).json({
            code: ERROR_CODES.INVALID_PARAMS,
            error: "Please provide sub-category name",
            key: "subCategoryName"
           })
        }

             
        if (!categoryId) {
            return res.status(400).json({
             code: ERROR_CODES.INVALID_PARAMS,
             error: "Please provide categoryId",
             key: "categoryId"
            })
         }

         const  [ findCatId, findSubCategory ] = await Promise.all([
            Category.findOne({ where: { categoryId }}),
            SubCategory.findOne({ where: { subCategoryId: subCatId }})
         ])
              
        if (!findCatId) {
            return res.status(404).json({
             code: ERROR_CODES.NOT_FOUND,
             error: "Category not found",
             key: "categoryId"
            })
         }

         if (!findSubCategory) {
            return res.status(404).json({
             code: ERROR_CODES.NOT_FOUND,
             error: "Sub Category not found",
             key: "subCatId"
            })
         }

        const doc = {
            subCategoryName,
            categoryId
        } 

        const updateSubCategory = await SubCategory.update(doc, { where: { subCategoryId: subCatId }});
        return res.status(200).json({
            code: ERROR_CODES.SUCCESS,
            data: updateSubCategory
        })

    } catch (error) {
        return handleCatchError(error, req, res)
    }
    
}

exports.getAllSubCategory = async (req,res)=>{
    try {
      const subCategories = await SubCategory.findAll(
        {
            include: [
                {
                    model: Category,
                    as: "category"
                }
            ]
        }
      )

      return res.status(200).json({
        code: ERROR_CODES.SUCCESS,
        data: subCategories
      })
    } catch (error) {
        return handleCatchError(error, req, res)
    }
}

exports.getSubCategoryByCategory = async (req,res)=>{
    try {
      const { catId } = req.params  
      const subCategories = await SubCategory.findAll(
        {   where:{ categoryId:catId },
            include: [
                {
                    model: Category,
                    as: "category"
                }
            ]
        }
      )

      return res.status(200).json({
        code: ERROR_CODES.SUCCESS,
        data: subCategories
      })
    } catch (error) {
        return handleCatchError(error, req, res)
    }
}