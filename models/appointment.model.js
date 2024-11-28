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
            target: 'User', // The target model name
            sourceKey: 'clientId', // Corrected sourceKey to match defined attribute
            foreignKey: 'userId', // Foreign key in the User model
            as: 'user', // Alias for this relationship
        },
    ];
    return Appointment
};
