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
          medications: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          surgeries: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          height: {
            type: DataTypes.FLOAT,
            allowNull: true,
          },
          weight: {
            type: DataTypes.FLOAT,
            allowNull: true,
          },
          physicalActivity: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          smoking: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          drinking: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          allergies: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          pcod: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          diabetes: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          bloodPressure: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          majorSurgery: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
            references: {
              model: 'users',
              key: 'userId',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }
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
