const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ApiFunction = require('./function');

const Dependency = sequelize.define('dependency', {
    parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dependency_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Api

module.exports = Tag;