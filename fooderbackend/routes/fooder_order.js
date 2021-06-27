const fooder_orderrouter = require('express').Router();
const FooderOrder = require('../models/fooder_order.model');
const FooderRegister = require('../models/fooder_register.model');
const {auth} = require('../models/fooder_auth');

const FooderOrderList = require('../models/fooder_orderlist.model');

fooder_orderrouter.route('/').get((req,res)=>{
    FooderOrder.find()
        .then(FooderOrder=>res.json(FooderOrder))
        .catch(err => res.status(400).json('Error: ' + err));
});


fooder_orderrouter.route('/order_lists').get((req,res)=>{
    FooderOrderList.find()
        .populate('order_list','order_title order_type order_qty order_price order_addon order_status order_method order_img')
        .then(FooderOrderList=>res.json(FooderOrderList))
        .catch(err => res.status(400).json('Error: ' + err));
});


//user profile with order
fooder_orderrouter.route('/order/add').post(auth,(req,res)=>{
    const {order_title,order_type,order_addon,order_qty,order_price,order_baseprice,order_subtotal,order_remarks,order_method,order_img} = req.body;
    let token = req.cookies.auth;

    FooderRegister.findByToken(token, function(err,result){
        if(err){
            console.log(err);
        } else {
            FooderOrder.findOneAndUpdate(
                {_refprofile:result._id,order_title: order_title, order_status:"Pending"},
                {
                    $set:{
                        order_title:order_title,
                        order_type: order_type,
                        order_addon:order_addon,
                        order_qty:order_qty,
                        order_price:order_price,
                        order_baseprice:order_baseprice,
                        order_subtotal:order_subtotal,
                        order_remarks: order_remarks,
                        order_method: order_method,
                        order_img:order_img
                    }
                },
                {upsert: true,new:true},function(err,order){
                    if(err){
                        console.log(err);
                    } else{
                        console.log(order.order_price);
                        FooderOrderList.findOneAndUpdate({_refprofile:result._id, order_status:"Pending"},
                            {$addToSet:{order_list:order._id}},
                            {upsert: true,new:true},function(err,orderresult){
                                if(err){
                                    console.log(err);
                                } else{
                                    FooderOrder.findOneAndUpdate(
                                        {_refprofile:result._id,_id:order._id,order_status:"Pending"},
                                        {$push:{_orderlist:orderresult._id}}
                                        ,function(err,result){
                                            if(err){
                                                console.log(err);
                                            } else{
                                                console.log(result);
                                            }
                                        }
                                    )

                                }
                            })
                    }
                }
            ).then(result => res.send({fooder_order:result}))
            .catch(err => res.status(400).json('Error: ' + err));
        }
    })
});



//order => populate with reference keys
fooder_orderrouter.route('/:_refprofile').get((req,res)=>{
    FooderOrder
    .find({_refprofile:req.params._refprofile})
    .populate('_refprofile','first_name last_name email address')
    .exec(function(err,order){
        res.json(order);
    });
});

fooder_orderrouter.route('/:id').put(auth,(req,res) => {
    const orderCash = {
        order_subtotal:req.body.order_subtotal,
        order_method:req.body.order_method,
        order_status:"Success"
    };

    let token = req.cookies.auth;
    let cookie_cpn_key = ["coupon","couponDiscount"]
    let coupon_list = req.cookies.coupon;
    let convert_cpn = coupon_list ? JSON.parse(coupon_list) : null;
    let refcoupon = coupon_list ? convert_cpn._id : null;

    FooderRegister.findByToken(token, function(err,result){
        if(err){
            console.log(err);
        } else {
            FooderOrderList.findOneAndUpdate(
                {_refprofile:result._id,order_status:"Pending"},
                {$set:{order_status:"Success",order_subtotal:orderCash.order_subtotal,_refcoupon:refcoupon}})
            .then(
                FooderOrder.findByIdAndUpdate(req.params.id,orderCash,function(err,result){
                    if(err){
                        console.log(err);
                    } else{
                        res.json({fooder_update:result})
                    }
                }
            )).catch(err => res.status(400).json('Error: ' + err));
        }
    })

    for(var i in cookie_cpn_key){
        res.clearCookie(cookie_cpn_key[i]);
    }
});


fooder_orderrouter.route('/:id').get((req,res)=>{
    FooderOrder.findById(req.params.id)
        .then(FooderOrder => res.json(FooderOrder))
        .catch(err => res.status(400).json('Error: ' + err));
});

fooder_orderrouter.route('/order_lists/:id').get((req,res)=>{
    FooderOrderList.findById(req.params.id)
        .populate('order_list','order_title order_type order_qty order_price order_addon order_status order_method order_img')
        .then(FooderOrderList => res.json(FooderOrderList))
        .catch(err => res.status(400).json('Error: ' + err));
})


fooder_orderrouter.route('/:id').delete((req,res) => {
    let token = req.cookies.auth;

    FooderOrder.findByIdAndDelete(req.params.id)
    .then(
        FooderRegister.findByToken(token, function(err,result){
            if(err){
                console.log(err);
            } else {
                FooderOrderList.findOneAndUpdate(
                    {_refprofile:result._id, order_status:"Pending"},
                    {$pull:{order_list:req.params.id}},
                    {upsert: true,new:true},function(err,order){
                    if(err){
                        console.log(err);
                    } else{
                        if(order.order_list.length<=0){
                            FooderOrderList.findByIdAndDelete(order._id)
                            .then(()=>res.send('Food Checkout Deleted'))
                            .catch(err => res.status(400).json('Error: ' + err))
                        }
                    }
                })
            }})
    )
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = fooder_orderrouter;

