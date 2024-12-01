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
        appointmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },  
      morningExercise: {
        type: DataTypes.JSON, // Storing as JSON to handle array data
        allowNull: false,
        defaultValue: [], // Default to an empty array
      },
      afternoonExercise: {
        type: DataTypes.JSON, // Storing as JSON to handle array data
        allowNull: false,
        defaultValue: [], // Default to an empty array
      },
      eveningExercise: {
        type: DataTypes.JSON, // Storing as JSON to handle array data
        allowNull: false,
        defaultValue: [], // Default to an empty array
      },
      nightExercise: {
        type: DataTypes.JSON, // Storing as JSON to handle array data
        allowNull: false,
        defaultValue: [], // Default to an empty array
      }
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
