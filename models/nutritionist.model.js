const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Nutritionist = sequelize.define('Nutritionist', {
        nutritionistId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'e.g., Sports Nutrition, Clinical Nutrition, Pediatric Nutrition',
        },
        experienceYears: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    }, {
        tableName: 'Nutritionists',
        freezeTableName: true,
        timestamps: true,  // Enable createdAt and updatedAt for tracking changes
    });

    // Associations example
    Nutritionist.associations = [
        {
            type: 'hasOne',
            target: 'User', 
            sourceKey: 'userId', 
            foreignKey: 'userId', 
            as: 'user', 
        },
        // {
        //     type: 'hasMany',
        //     target: 'Appointment', // The target model name
        //     sourceKey: 'userId', // Corrected sourceKey to match defined attribute
        //     foreignKey: 'professionalId', // Foreign key in the User model
        //     as: 'appointments', // Alias for this relationship
        // }
    ]

    return Nutritionist;
};
