const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Client = sequelize.define('Client', {
        clientId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        bmi: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        bloodGroup: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        medicalHistory: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        allergies: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true, // If 1:1 relationship
            references: {
                model: 'users',
                key: 'userId',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: false,
        },
    }, {
        tableName: 'clients',
        freezeTableName: true,
        timestamps: false,
    });

    // Define associations using the custom `associations` property
    Client.associations = [
        {
            type: 'hasOne',
            target: 'User', // The target model name
            sourceKey: 'userId', // Corrected sourceKey to match defined attribute
            foreignKey: 'userId', // Foreign key in the User model
            as: 'user', // Alias for this relationship
        },
    ];

    return Client;
};
