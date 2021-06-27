const fooder_maindishrouter = require('express').Router();
const FooderMainDish = require('../models/fooder_maindish.model');

fooder_maindishrouter.route('/').get((req,res)=>{
    FooderMainDish.find()
        .populate("_refaddon","addon price_addon")
        .then(FooderMenu => res.json(FooderMenu))
        .catch(err => res.status(400).json('Error: ' + err));
})

fooder_maindishrouter.route('/type').get((req, res) => {
    var type = req.query.type;
    FooderMainDish
        .find({type: type})
        .exec(function(err,cat){
            res.json(cat);
        })
});


fooder_maindishrouter.route('/add').post((req,res) => {
    const maindish = req.body.maindish;
    const description = req.body.description;
    const type = req.body.type;
    const baseprice = req.body.baseprice;
    const category = req.body.category;
    const origin = req.body.origin;
    const status = req.body.status;
    const upload_img = req.body.upload_img;
    const _refaddon = req.body._refaddon;

    const newFooderDish = new FooderMainDish({
        maindish,
        description,
        type,
        baseprice,
        category,
        origin,
        status,
        upload_img,
        _refaddon
    });

    newFooderDish.save()
    .then(() => res.json('Food Main Dish added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


fooder_maindishrouter.route('/:id').get((req,res)=>{
    FooderMainDish
    .findById(req.params.id)
    .populate("_refaddon","addon price_addon")
    .then(FooderMainDish => res.json(FooderMainDish))
    .catch(err => res.status(400).json('Error: ' + err));
});

fooder_maindishrouter.route('/:id').delete((req,res) => {
    FooderMainDish.findByIdAndDelete(req.params.id)
        .then(() => res.json('Food Main Dish Deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

fooder_maindishrouter.route('/update/:id').put(function(req,res) {
    const {maindish,description,type,baseprice,category,origin,status,upload_img,_refaddon} = req.body;
    const foodMainUpdate = {
        maindish : maindish,
        description : description,
        type : type,
        baseprice : baseprice, //base price
        category : category,
        origin : origin,
        status : status,
        upload_img: upload_img
    }

    FooderMainDish.findByIdAndUpdate(req.params.id,foodMainUpdate,{upsert: true, new : true}, function(err,foodmaindishupdate){
        if(!foodmaindishupdate)
            res.status(404).send("data is not found");
        else
            FooderMainDish.findOneAndUpdate({_id:req.params.id},{$addToSet:{_refaddon:_refaddon}}, function(err,foodaddonupdate){
                if(err){
                    res.status(404).send("data is not found");
                } else{
                    console.log(foodaddonupdate);
                }
            })
            res.json({_foodermaindish:foodmaindishupdate});
    });



    // FooderMainDish.findById(req.params.id, function(err,foodmaindishupdate){
    //     if(!foodmaindishupdate)
    //         res.status(404).send("data is not found");
    //     else
    //         foodmaindishupdate.maindish = req.body.maindish;
    //         foodmaindishupdate.description = req.body.description;
    //         foodmaindishupdate.type = req.body.type;
    //         foodmaindishupdate.baseprice = req.body.baseprice; //base price
    //         foodmaindishupdate.category = req.body.category; 
    //         foodmaindishupdate.origin = req.body.origin; 
    //         foodmaindishupdate.status = req.body.status;
    //         foodmaindishupdate._refaddon = req.body._refaddon;

    //         foodmaindishupdate.save().then(foodmaindishupdate => {
    //             res.json({_foodermaindish:foodmaindishupdate});
    //         })
    //         .catch(err => {
    //             res.status(400).json('Error: ' + err);
    //         });
    // });
});


module.exports = fooder_maindishrouter;