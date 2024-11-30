const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        userEmail: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: {
                name: 'unique_user_email',
                msg: 'This email is already in use.'
            },
        },
        
        userPassword: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userRole: {
            type: DataTypes.ENUM('Client', 'Nutritionist', 'YogaTrainer'),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: true,
          },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isFirstLogin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        lastLoginAt: {
            type: DataTypes.DATE
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'users',
        freezeTableName: true,
        timestamps: false,
    });

    User.associations = [
        {
            type: 'hasOne',
            target: 'Client',
            foreignKey: 'userId',
            as: 'client', 
        },
        {
            type: 'hasOne',
            target: 'Nutritionist',
            foreignKey: 'userId',
            as: 'nutritionist', 
        },
        {
            type: 'hasOne',
            target: 'YogaTrainer',
            foreignKey: 'userId',
            as: 'yogaTrainer', 
        },
    ];
    return User
};