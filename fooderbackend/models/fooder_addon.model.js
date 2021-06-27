const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let foodmenuSchema = new Schema({
    // addon_maindish:{type:String},
    addon:{type:String}, //addon
    price_addon:{type:Number} //price
    // _refmaindish :[
    //     {type: Schema.Types.ObjectId, ref: 'FooderMainDish'}
    // ]
});

foodmenuSchema.set('timestamps', true);

const FooderMenu = mongoose.model('FooderAddon',foodmenuSchema);

module.exports = FooderMenu;