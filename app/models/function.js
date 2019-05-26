const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ApiFunction = sequelize.define('function', {
    function_id: {
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
    function_code: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});



module.exports = ApiFunction;