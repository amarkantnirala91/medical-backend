const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Exercise = sequelize.define('Exercise', {
        exerciseId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        yogaTrainerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exerciseName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        frequency: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        planFee: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'Exercises',
        freezeTableName: true,
        timestamps: false,
    });

    Exercise.associations = [
        {
            type: 'hasOne',
            target: 'Client',
            sourceKey: 'clientId', 
            foreignKey: 'userId',
            as: 'client', 
        },
        {
            type: 'hasOne',
            target: 'YogaTrainer',
            sourceKey: 'yogaTrainerId', 
            foreignKey: 'userId',
            as: 'yogaTrainer', 
        }
    ]


    return Exercise;
};
