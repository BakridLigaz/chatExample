var Sequelize = require('sequelize');

var attributes = {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type:Sequelize.BOOLEAN
    }
};

var options = {
    freezeTableName: true,
    timestamps: false
};

module.exports.attributes = attributes;
module.exports.options = options;
