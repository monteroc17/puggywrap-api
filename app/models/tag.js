const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Tag = sequelize.define('tag', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});



module.exports = Tag;