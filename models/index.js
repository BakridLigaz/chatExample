var UserMeta = require('../meta/User'),
    sequelize = require('../sequelize');


var User = sequelize.define('users', UserMeta.attributes, UserMeta.options);
var Dialog = sequelize.define('dialogs',{},UserMeta.options);
var Message = sequelize.define('messages',{},UserMeta);
User.hasMany(Dialog, {
    foreignKey: {
        name: 'uid',
        allowNull: false
    }
});
Dialog.hasMany(Message,{
    foreignKey: {
        name: 'uid',
        allowNull: false
    }
});
Message.sync();
Dialog.sync();
User.sync();

module.exports.User = User;
