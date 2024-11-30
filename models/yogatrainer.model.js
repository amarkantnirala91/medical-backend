const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const YogaTrainer = sequelize.define('YogaTrainer', {
        yogaTrainerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experienceYears: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {
        tableName: 'YogaTrainers',
        freezeTableName: true,
        timestamps: true
    });
    YogaTrainer.associations = [
        {
            type: 'hasOne',
            target: 'User', // The target model name
            sourceKey: 'userId', // Corrected sourceKey to match defined attribute
            foreignKey: 'userId', // Foreign key in the User model
            as: 'user', // Alias for this relationship
        }
    ]
    return YogaTrainer;
};
