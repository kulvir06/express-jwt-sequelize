module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    });

    return User;
};