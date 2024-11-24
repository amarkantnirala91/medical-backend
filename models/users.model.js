const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userRole: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        supplierId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        userName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        userEmail: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        userMobile: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        userPassword: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false, // Default value set to boolean false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        isFirstLogin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'users',
        freezeTableName: true,
        timestamps: false,
    });
};
