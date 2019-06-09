const Sequelize = require('sequelize');

const sequelize = new Sequelize('puggywrap', 'usr_puggywrap', 'MBR9O9AoxRjAHyRu', {
    dialect: 'mysql',
    host: 'leoviquez.com',
    port: 3307
});

module.exports = sequelize;