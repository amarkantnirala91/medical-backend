// modelManager.js
const getModel = (modelName) => {
    const models = require('./server').get('models');
    if (!models[modelName]) {
        throw new Error(`Model ${modelName} not found`)
    }
    return models[modelName];
};

module.exports = {
    getModel,
};