const Sequelize = require('sequelize');
const database = require('./db');

const New_Client = database.define('new_client', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cnpj: {
        type: Sequelize.STRING,
        allowNull: true
    },
    fone: Sequelize.STRING,
    email: Sequelize.STRING,
    socio: Sequelize.STRING,
    municipio: Sequelize.STRING,
    isSendMail: Sequelize.STRING
})

module.exports = New_Client;