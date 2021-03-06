const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = require('./user');

const ApiFunction = sequelize.define('function', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

ApiFunction.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(ApiFunction);

module.exports = ApiFunction;