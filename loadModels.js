// loadModels.js
const fs = require('fs');
const { isArray } = require('lodash');
const path = require('path');

function loadModels(sequelize, modelsDir) {
    const models = {};

    console.log(`\nLoad models:`)
    if (fs.existsSync(modelsDir)) {
        fs.readdirSync(modelsDir)
            .filter(file => file.endsWith('model.js'))
            .forEach(file => {
                const model = require(path.join(modelsDir, file))(sequelize);
                models[model.name] = model;
                console.log(`- ${model.name}`);
            });
    }

    // add association after all models init
    Object.keys(models).forEach((modelName) => {
        const model = models[modelName];
        const associations = model.associations || [];

        if (!isArray(associations)) {
            return;
        }

        associations.forEach(association => {
            if (association.type === 'belongsTo') {
                const targetModel = models[association.target];
                if (targetModel) {
                    model.belongsTo(targetModel, {
                        as: association.as,
                        sourceKey: association.sourceKey,
                        foreignKey: association.foreignKey,
                        constraints: association.constraints
                    });
                }
            } else if (association.type === 'hasMany') {
                const targetModel = models[association.target];
                if (targetModel) {
                    model.hasMany(targetModel, {
                        as: association.as,
                        sourceKey: association.sourceKey,
                        foreignKey: association.foreignKey,
                        constraints: association.constraints
                    });
                }
            } else if (association.type === 'hasOne') {
                const targetModel = models[association.target];
                if (targetModel) {
                    model.hasOne(targetModel, {
                        as: association.as,
                        sourceKey: association.sourceKey,
                        foreignKey: association.foreignKey,
                        constraints: association.constraints
                    });
                }
            }
            else if (association.type === 'belongsToMany') {
                const targetModel = models[association.target];
                const throughModel = models[association.through];

                if (targetModel) {
                    model.belongsToMany(targetModel, {
                        through: throughModel,
                        foreignKey: association.foreignKey,
                        otherKey: association.otherKey,
                        as: association.as,
                        constraints: association.constraints
                    });
                }
            }
        });
    })
    return models;
}

module.exports = loadModels;
