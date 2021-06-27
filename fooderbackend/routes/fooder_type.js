const fooder_typerouter = require('express').Router();
const FooderType = require('../models/fooder_type.model');

fooder_typerouter.route('/').get((req,res)=>{
    FooderType.find()
        .then(FooderType => res.json(FooderType))
        .catch(err => res.status(400).json('Error: ' + err));
})

fooder_typerouter.route('/add').post((req,res)=>{
    const foodtype = req.body.foodtype;
    const foodalias = req.body.foodalias;
    const foodimgname = req.body.foodimgname;

    const newFooderType = new FooderType({
        foodtype,
        foodalias,
        foodimgname
    });
    

    newFooderType.save()
    .then(()=> res.json('Food Types added!'))
    .catch(err=> res.status(400).json('Error: ' + err));
});

fooder_typerouter.route('/:id').delete((req,res) => {
    FooderType.findByIdAndDelete(req.params.id)
        .then(() => res.json('Food Types Deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
})

fooder_typerouter.route('/update/:id').put(function (req,res){
    FooderType.findById(req.params.id,function (err,foodtypeupdate){
        if(!foodtypeupdate)
            res.status(404).send("data is not found");
        else
            foodtypeupdate.foodtype = req.body.foodtype;
            foodtypeupdate.foodalias = req.body.foodalias;
            foodtypeupdate.foodimgname = req.body.foodimgname;

            foodtypeupdate.save().then(foodtypeupdate => {
                res.json('Food Type Updated');
            })
            .catch(err => {
                res.status(400).json('Error: ' + err);
            });
    });
});

module.exports = fooder_typerouter;