const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let foodcouponSchema = new Schema({
    cpn_name:{type:String, required:true},
    cpn_desc:{type:String},
    cpn_value:{type:Number, required:true},
    cpn_type:{type:String},
    cpn_datefrom:{type:Date},
    cpn_dateto:{type:Date},
    cpn_status:{type:String}
})

foodcouponSchema.set('timestamps', true);

const FooderCoupon = mongoose.model('FooderCoupon',foodcouponSchema);

module.exports = FooderCoupon;