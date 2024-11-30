const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const DietPlan = sequelize.define('DietPlan', {
        dietPlanId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nutritionistId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        planName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        planFee: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        totalCalories: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        totalGrams: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        protein: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        carbs: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        fats: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'diet_plans',
        freezeTableName: true,
        timestamps: false,
    });

    DietPlan.associations = [
        {
            type: 'hasOne',
            target: 'Client',
            sourceKey: 'clientId', 
            foreignKey: 'userId',
            as: 'client', 
        },
        {
            type: 'hasOne',
            target: 'Nutritionist',
            sourceKey: 'nutritionistId', 
            foreignKey: 'userId',
            as: 'nutritionist', 
        }
    ]

    return DietPlan
};
