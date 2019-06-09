const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const function_code = require('./function');

const ApiVersion = sequelize.define('version', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    function_code: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    version: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

ApiVersion.belongsTo(function_code, { constraints: true, onDelete: 'CASCADE' });
function_code.hasMany(ApiVersion);

module.exports = ApiVersion;