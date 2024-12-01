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
        appointmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        breakfast: {
            type: DataTypes.JSON,  // Storing as JSON to handle array data
            allowNull: false,
            defaultValue: [], // Default to an empty array
        },
        lunch: {
            type: DataTypes.JSON,  // Storing as JSON to handle array data
            allowNull: false,
            defaultValue: [], // Default to an empty array
        },
        eveningSnack: {
            type: DataTypes.JSON,  // Storing as JSON to handle array data
            allowNull: false,
            defaultValue: [], // Default to an empty array
        },
        dinner: {
            type: DataTypes.JSON,  // Storing as JSON to handle array data
            allowNull: false,
            defaultValue: [], // Default to an empty array
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

    // Associations
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
        },
        {
            type: 'hasOne',
            target: 'Appointment', // Assuming there's an Appointment model
            sourceKey: 'appointmentId',
            foreignKey: 'appointmentId', // Update with the correct foreign key if different
            as: 'appointment',
        }
    ];

    return DietPlan;
};
