import Sequelize from 'sequelize';

//initialize an instance of Sequelize
const sequelize = new Sequelize( 'authPrac', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

//check connection to database
sequelize.authenticate()
 .then(() => console.log('Connection to database established successfully'))
 .catch((err) => console.error('Unable to connect to database: ',err));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
