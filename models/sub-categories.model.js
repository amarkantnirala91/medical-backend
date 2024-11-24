const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SubCategory = sequelize.define('SubCategory', {
        subCategoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        subCategoryName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },

        categoryId: { // Foreign key to reference Category
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        tableName: 'sub_categories',
        freezeTableName: true,
        timestamps: false,
    });

    // Define associations
    SubCategory.associations = [
        {
            type: 'belongsTo',
            target: 'Category',
            foreignKey: 'categoryId',
            as: 'category', // Alias for the relationship
        },
    ];

    return SubCategory;
};
