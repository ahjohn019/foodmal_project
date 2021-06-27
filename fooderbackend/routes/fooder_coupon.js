const fooder_ordercoupon = require('express').Router();
const FooderCoupon = require('../models/fooder_coupon.model');

fooder_ordercoupon.route('/').get((req,res)=>{
    FooderCoupon.find()
        .then(FooderCoupon=>res.json(FooderCoupon))
        .catch(err => res.status(400).json('Error: ' + err));
});


fooder_ordercoupon.route('/add').post((req,res)=>{
    const {cpn_name,cpn_desc,cpn_value,cpn_type,cpn_datefrom,cpn_dateto,cpn_status} = req.body;
    const newCoupon = new FooderCoupon({
        cpn_name,
        cpn_desc,
        cpn_value,
        cpn_type,
        cpn_datefrom,
        cpn_dateto,
        cpn_status
    })

    newCoupon.save()
    .then(() => res.json('Food Coupon Added'))
    .catch(err => res.status(400).json('Error: ' + err));
})

fooder_ordercoupon.route('/:id').get((req,res)=>{
    FooderCoupon.findById(req.params.id)
        .then(FooderCoupon => res.json(FooderCoupon))
        .catch(err => res.status(400).json('Error: ' + err));
});

fooder_ordercoupon.route('/:id').delete((req,res)=>{
    FooderCoupon.findByIdAndDelete(req.params.id)
        .then(() => res.json('Food Menu Deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

fooder_ordercoupon.route('/update/:id').put(function (req, res) {
    const {cpn_name,cpn_desc,cpn_value,cpn_type,cpn_datefrom,cpn_dateto,cpn_status} = req.body;
    const newCouponUpdate = {
        cpn_name: cpn_name,
        cpn_desc: cpn_desc,
        cpn_value: cpn_value,
        cpn_type:cpn_type,
        cpn_datefrom: cpn_datefrom,
        cpn_dateto,
        cpn_status: cpn_status
    }

    FooderCoupon.findByIdAndUpdate(req.params.id, newCouponUpdate,{upsert: true, new : true}, function(err,foodcouponupdate){
        if(!foodcouponupdate)
            res.status(404).send("data is not found");
        else
            res.json({_foodercoupon:foodcouponupdate});
    })
})



module.exports = fooder_ordercoupon;