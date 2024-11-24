const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Category = sequelize.define('Category', {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        categoryName: {
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
    }, {
        tableName: 'categories',
        freezeTableName: true,
        timestamps: false,
    });

    // Define associations
    Category.associations = [
        {
            type: 'hasMany',
            target: 'SubCategory',
            foreignKey: 'categoryId',
            as: 'subCategories', // Alias for the relationship
        },
    ];

    return Category;
};
