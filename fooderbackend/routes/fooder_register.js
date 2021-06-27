const fooder_registerouter = require('express').Router();
const FooderRegister = require('../models/fooder_register.model');
const FooderOrder = require('../models/fooder_order.model');
const {auth} = require('../models/fooder_auth');
const { check, validationResult } = require('express-validator');


fooder_registerouter.route('/').get((req,res)=>{
    FooderRegister.find()
        .then(FooderRegister => res.json(FooderRegister))
        .catch(err => res.status(400).json('Error: ' + err));
})

//fooder register authenticcation
fooder_registerouter.route('/add').post([
    check('first_name').trim().isLength({min:2, max:8}).withMessage('First Name Must Have Between 2 to 8'),
    check('last_name').trim().isLength({min:2, max:8}).withMessage('Last Name Must Have Between 2 to 8'),
    check('email').trim().isEmail().withMessage('Wrong Email Format'),
    check('password').trim().isLength({min: 6}).withMessage('Passwword Must Have At Least 6 Character'),
    check('password_confirmation').trim().isLength({min: 6}).withMessage('Passwword Must Have At Least 6 Character'),
    ],(req,res)=>
    {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const {first_name,last_name,email,dob,address,state,country,phonenumber,password,password_confirmation} = req.body;
        const stripe_id = "";
    
        const newFoodRegister = new FooderRegister({
            first_name,
            last_name,
            email,
            dob,
            address,
            state,
            country,
            phonenumber,
            password,
            password_confirmation,
            stripe_id
        });

        if(newFoodRegister.password!=newFoodRegister.password_confirmation) return res.status(400).json({message: "Password Mismatch, Please Try Again"});
        
        FooderRegister.findOne({email:newFoodRegister.email},function(err,user){
            if(user) return res.status(400).json({ auth : false, message :"email exits"});
            newFoodRegister.save((err,doc)=>{
                if(err) {
                    console.log(err);
                    return res.status(400).json({ success : false});
                }
                res.status(200).json({
                    success:true,
                    user : doc
                });
            });
        });
})


//fooder login authentication
fooder_registerouter.route('/login').post((req,res)=>{
    let token = req.cookies.auth;

    FooderRegister.findByToken(token,(err,user)=>{
        if(err) return  res(err);
        if(user) return res.status(400).json({
            error :true,
            message:"You are already logged in"
        });

        else {
            FooderRegister.findOne({'email':req.body.email.trim()},function(err,user){
                if(!user) return res.json({isAuth : false, message : 'Auth failed ,email not found'});
                user.comparepassword(req.body.password.trim(),(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false, message : "password doesn't match"});
                    user.generateToken((err,user)=>{
                        if(err) return res.status(400).send(err);
                        res.cookie('auth',user.token).json({
                            isAuth : true,
                            id : user._id,
                            email : user.email
                        });
                    });  
                });
            });
        }
    });
});

//fooder profile authentication
fooder_registerouter.route('/profile').get(auth,(req,res)=>{

    res.json({ 
        isAuth:true,
        id:req.user._id,
        email:req.user.email,
        name:req.user.first_name+req.user.last_name,
        dob:req.user.dob,
        address:req.user.address,
        state: req.user.state,
        country:req.user.country,
        phonenumber:req.user.phonenumber,
        stripe_id:req.user.stripe_id,
        token:req.user.token
    })
});


//fooder profile update with authentication
fooder_registerouter.route('/profile/:id').put(auth,(req,res)=>{
    const {email, first_name, last_name, address,dob, state, country,phonenumber,stripe_id} = req.body;
    
    FooderRegister.findById(req.params.id)
        .then(FooderRegister =>{
            FooderRegister.email = email;
            FooderRegister.first_name = first_name;
            FooderRegister.last_name = last_name;
            FooderRegister.address = address;
            FooderRegister.dob = dob;
            FooderRegister.state = state;
            FooderRegister.country = country;
            FooderRegister.phonenumber = phonenumber;
            FooderRegister.stripe_id = stripe_id;

            FooderRegister.save()
                .then(() => res.json('Profile Updated'))
                .catch(err => res.status(400).json('Error: ' + err));
        })

});


//fooder profile logout
fooder_registerouter.route('/logout').get(auth,(req,res)=>{
    req.user.deleteToken(req.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.json({
            isLogout:true
        })
    })
})


fooder_registerouter.route('/:id').get((req, res)=>{
    FooderRegister.findById(req.params.id)
        .then(FooderRegister => res.json(FooderRegister))
        .catch(err => res.status(400).json('Error: ' +err));
});

fooder_registerouter.route('/:id').delete((req, res)=>{
    FooderRegister.findByIdAndDelete(req.params.id)
        .then(FooderRegister => res.json('User Info Deleted'))
        .catch(err => res.status(400).json('Error: ' +err));
});

module.exports = fooder_registerouter;