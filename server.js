
const express = require('express');
const app = express();
const port = 8000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser =require('cookie-parser');
const path = require('path');
var cors = require('cors');
var compression = require('compression'); //import to app	
app.use(compression());

app.use(bodyParser.json());
app.use(cookieParser());

require("dotenv").config();
app.use(cors());

const uri = "mongodb+srv://ahrui123:ahrui123@myprojectcluster.9c5nh.mongodb.net/fooder-maindb?retryWrites=true&w=majority"
 

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));//build



//connect to mongoose db
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
//create router
const FooderMainDishRouter = require('./fooderbackend/routes/fooder_maindish');
const FooderAddOnRouter = require('./fooderbackend/routes/fooder_addon');
const FooderTypeRouter = require('./fooderbackend/routes/fooder_type');
const FooderRegisterRouter = require('./fooderbackend/routes/fooder_register');
const FooderOrderRouter = require('./fooderbackend/routes/fooder_order');
const FooderCouponRouter = require('./fooderbackend/routes/fooder_coupon');

//test stripe routers
const FooderStripeRouter = require('./fooderbackend/routes/fooder_stripe')

app.use('/api/fooder_maindish', FooderMainDishRouter)
app.use('/api/fooder_addon',FooderAddOnRouter);
app.use('/api/fooder_type',FooderTypeRouter);
app.use('/api/fooder_register',FooderRegisterRouter);
app.use('/api/fooder_order',FooderOrderRouter);
app.use('/api/fooder_stripe',FooderStripeRouter);
app.use('/api/fooder_coupon',FooderCouponRouter);

app.get('*', function (req, res){
  res.sendFile(path.join(__dirname+'/build/index.html'));//'/build/index.html'
})


app.listen((process.env.PORT || port), function(){
    console.log(`Example app listening at http://localhost:${port}`)
});

