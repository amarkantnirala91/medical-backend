const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Subscription = sequelize.define('Subscription', {
        subId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        planName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            comment: "Subscription duration in days",
          },
          status: {
            type: DataTypes.ENUM('active', 'inactive', 'cancelled'),
            defaultValue: 'active',
          },

    }, {
        tableName: 'subscriptions',
        freezeTableName: true,
        timestamps: false,
    });
    Subscription.associations = [
        {
            type: 'hasOne',
            target: 'User', // The target model name
            sourceKey: 'userId', // Corrected sourceKey to match defined attribute
            foreignKey: 'userId', // Foreign key in the User model
            as: 'user', // Alias for this relationship
        }
    ]
    return Subscription
};