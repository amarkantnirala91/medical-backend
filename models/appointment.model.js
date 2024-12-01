const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Appointment = sequelize.define('Appointment', {
        appointmentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        professionalId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        appointmentDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        appointmentFee: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled'),
            defaultValue: 'Pending',
        },
        time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'appointments',
        freezeTableName: true,
        timestamps: false,
    });

    Appointment.associations = [
        {
            type: 'hasOne',
            target: 'User', 
            sourceKey: 'clientId', 
            foreignKey: 'userId', 
            as: 'user', 
        },
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
            sourceKey: 'professionalId', 
            foreignKey: 'userId', 
            as: 'yogaTrainer', 
        },
        {
            type: 'hasOne',
            target: 'Nutritionist', 
            sourceKey: 'professionalId', 
            foreignKey: 'userId', 
            as: 'nutritionist', 
        },
    ];
    return Appointment
};
