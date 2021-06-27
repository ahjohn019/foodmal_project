const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let food_orderListSchema = new Schema({
    _refprofile:{type:Schema.Types.ObjectId, ref:'FooderRegister'},    
    order_list:[{
        type:Schema.Types.ObjectId, ref:'FooderOrder'
    }],
    order_status:{type:String},
    order_subtotal:{type:Number},
    _refcoupon:{type:Schema.Types.ObjectId, ref:'FooderCoupon'}
})
food_orderListSchema.set('timestamps', true);

const FooderOrderList = mongoose.model('FooderOrderList',food_orderListSchema);

module.exports = FooderOrderList;