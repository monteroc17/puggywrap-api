const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ApiFunction = sequelize.define('function', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = ApiFunction;