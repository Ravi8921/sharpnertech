const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./registerModel');

const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.UUID,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    expiresby: {
        type: Sequelize.DATE,
        allowNull: false
    }
});
User.hasMany(Forgotpassword, { foreignKey: 'userId' });
Forgotpassword.belongsTo(User, { foreignKey: 'userId' });
module.exports = Forgotpassword;
