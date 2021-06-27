const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let foodtypeSchema = new Schema({
    foodtype: {type:String, required:true},
    foodalias: {type:String, required:true},
    foodimgname:{type:String }
});

foodtypeSchema.set('timestamps', true);

const FooderType = mongoose.model('FooderType',foodtypeSchema);

module.exports = FooderType;