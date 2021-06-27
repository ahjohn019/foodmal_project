const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const salt=10;

const Schema = mongoose.Schema;

let foodRegisterSchema = new Schema({
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String},
    dob:{type:String},
    address:{type: [String] },
    state:{type:String},
    country:{type:String},
    phonenumber:{type:String},
    password:{type:String},
    password_confirmation:{type:String},
    token:{type:String},
    stripe_id:{type:String}
});

foodRegisterSchema.set('timestamps',true);

foodRegisterSchema.pre('save', function (next) {
    var userRegister = this;

    if(userRegister.isModified('password')){
        bcrypt.genSalt(salt,function(err,salt){
            if(err)return next(err);

            bcrypt.hash(userRegister.password,salt,function(err,hash){
                if(err) return next(err);
                userRegister.password=hash;
                userRegister.password_confirmation=hash;
                next();
            })
        })
    } else {
        next();
    }
});

foodRegisterSchema.methods.comparepassword = function(password,cb){
    bcrypt.compare(password,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch);
    });
   
}

// generate token
foodRegisterSchema.methods.generateToken=function(cb){
    var userRegister = this;
    var token = jwt.sign(userRegister._id.toHexString(), process.env.ACCESSTOKEN);
    userRegister.token=token;
    userRegister.save(function(err,userRegister){
        if(err) return cb(err);
        cb(null,userRegister);
    })
}

// find by token
foodRegisterSchema.statics.findByToken=function(token,cb){
    var userRegister=this;

    jwt.verify(token,process.env.ACCESSTOKEN,function(err,decode){
        userRegister.findOne({"_id": decode, "token":token},function(err,userRegister){
            if(err) return cb(err);
            cb(null,userRegister);
        })
    })
};

//delete token
foodRegisterSchema.methods.deleteToken=function(token,cb){
    var userRegister=this;

    userRegister.update({$unset : {token :1}},function(err,userRegister){
        if(err) return cb(err);
        cb(null,userRegister);
    })
}

const FoodRegister = mongoose.model('FooderRegister',foodRegisterSchema);

module.exports = FoodRegister;