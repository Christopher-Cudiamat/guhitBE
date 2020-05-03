const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConnect');
const cors = require('cors');
const passport = require('passport');


//instance of exp.js
const app = express();



//Connect database
connectDB();

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({extended:false}));
app.use('/uploads', express.static('uploads'))

app.get('/', (req,res) => res.send('API IS UP AND RUNNING'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profiles', require('./routes/api/profiles'));
app.use('/api/series', require('./routes/api/series'));


app.use(passport.initialize());

//if there is no port yet fallback to lh 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));