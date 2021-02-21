import express from 'express';
import bodyParser from 'body-parser';

import db from './database';

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

//start the app
app.listen(3000, () => {
    console.log('Server is running on port 3000!!');
})