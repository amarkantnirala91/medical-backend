require("dotenv").config();

module.exports = {
    env: process.env.ENV || 'dev',
    logo: process.env.APP_NAME || 'RECKITT',
    appName: process.env.APP_NAME || 'RECKITT',
    dbConfig: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB,
        host: process.env.DB_HOST,
        dialect: 'postgres', // or 'postgres', 'sqlite', etc.
    },
};
