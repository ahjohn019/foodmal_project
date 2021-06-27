
const FooderRegister = require('../models/fooder_register.model');

let auth =(req,res,next)=>{
    let token = req.cookies.auth;

    FooderRegister.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            error :true,
            isAuth: false
        });

        req.token= token;
        req.user=user;
        next();
    })
}

module.exports={auth};