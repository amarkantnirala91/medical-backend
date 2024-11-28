require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const swaggerDocument = require('./swagger.json');
const loadModels = require('./loadModels');
const loadRoutes = require('./loadRoutes');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(
    express.urlencoded({ extended: true })
);
app.get("/", (req, res) => {
    return res.redirect('/api-docs');
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Initialize Sequelize
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
});

const models = loadModels(sequelize, path.join(__dirname, 'models'));  // Load all plugin models dynamically

app.set('models', models);
(async ()=>{
  await sequelize.sync({ logging: true });
})().then( async ()=>{
  const allRoutes = await loadRoutes(app, path.join(__dirname, 'modules'));  // Load all plugin routes dynamically
  console.log('\nDatabase synchronized');
})
// Check the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
  
module.exports = app;
app.listen(port, () => {
    console.log(`\nServer is running on port ${port}`);
});
