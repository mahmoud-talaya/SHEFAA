// start with express
const express = require('express')

// start mongoose 
const mongoose = require('mongoose')


// use fs module to load modules with their relative path
const fs = require('fs');

// use body parser
const bodyParser = require("body-parser")

// use a cors module to enable connecting from any other environment to this API using the url(localhost:3000)
var cors = require('cors')

const authRouter = require('./routes/auth')

const passportsetup = require('./config/passport-setup')

const keys = require('./config/keys')

const cookieSession = require('cookie-session')

const passport = require('passport')

const session = require('express-session')

const userRouter = require('./routes/user')

const homeRouter = require('./routes/home')

const productRouter = require('./routes/product')

const previousorderRouter = require('./routes/previousOrder')

const cartRouter = require('./routes/cart')

// ----------------------------------------------------

// an instance from express object
const app = express();

// body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//enabling the cors options
// using cors middleware
app.use(cors());

app.options('*', cors());


// use middleware
app.use('/user', userRouter);


// use cookie session
app.use(cookieSession({
    // maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
    overwrite: false
}))



// now we initailize passport 
app.use(passport.initialize())

// now we want passport to use cookies
app.use(passport.session())


// use auth middleware
app.use('/auth', authRouter)


// home router
app.use('/home', homeRouter)

// product router
app.use('/product', productRouter)
// Previos orders router
app.use('/porder', previousorderRouter);

// cart router
app.use('/cart', cartRouter);


// ----------------------------------------------------


mongoose.set('useFindAndModify', false);

// use mongoose to access database 
mongoose.connect(keys.mongodb.dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});



// ----------------------------------------------------


// use fs to select the files of modles
var modelFiles = fs.readdirSync(__dirname + "/models/");
modelFiles.forEach((file) => {
    require(__dirname + "/models/" + file);
});


// ----------------------------------------------------

// listen on port 3000
app.listen(3000, () => {
    console.log("server is running successfully on port 3000")
})