import express from 'express';
import bodyParser from 'body-parser';

import db from './database';
import helperMethods from './helper-methods';

const app = express();

//parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//connecting to database
const exe  = async() => {
    await db.sequelize.sync();
}
exe();



//add a basic route
app.get('/', (req, res) => {
    res.json({ message: 'Express is up!' });
});

//get all users
app.get('/users', (req, res) => {
    const obj = new helperMethods();
    obj.getAllUsers().then(user => res.json(user));    
});

//register route
app.post('/register', (req, res, next) => {
    const obj = new helperMethods();
    const { name, password } = req.body;

    obj.createUser({ name, password })
     .then(user => res.json({ user, msg: 'account created successfully' }));
});






//start the app
app.listen(3000, () => {
    console.log('Server is running on port 3000!!');
})