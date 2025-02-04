import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import db from './database';
import helperMethods from './helper-methods';

//import passport and passport-jwt modules
import passport from 'passport';
import passportJWT from 'passport-jwt';

//ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;

//JwtStrategy which is the strategy for authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

//lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    const obj = new helperMethods();
    console.log('payload recieved', jwt_payload);
    let user = obj.getUser({ id: jwt_payload.id });
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
//use the strategy
passport.use(strategy);

const app = express();

//parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//initialise passport
app.use(passport.initialize());

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

//login route

app.post('/login', async (req, res, next) => {
    const obj = new helperMethods();
    const { name, password } = req.body;
    if (name && password){
        //we get the user with the name and save the resolved promise returned
        let user = await obj.getUser({ name });
        if(!user) {
            res.status(401).json({ msg: 'No such user found', user });
        }
        if(user.password===password){
            //from now on we will identify the user by the id and the id is the only personalized value that goes into our token
            let payload = { id: user.id };
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({ msg: 'ok', token: token });
        } else {
            res.status(401).json({ msg: 'Password is incorrect' });
        }
    }
});

//protected route
app.get('/protected', passport.authenticate('jwt', { session: false }), (req,res) => {
   res.json({ msg: 'You are seeing this because you are authorized' }); 
});


//start the app
app.listen(3000, () => {
    console.log('Server is running on port 3000!!');
})