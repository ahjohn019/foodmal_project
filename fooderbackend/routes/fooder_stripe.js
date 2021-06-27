const fooder_striperouter = require('express').Router();
const FooderRegister = require('../models/fooder_register.model');
const {auth} = require('../models/fooder_auth');

// This is a sample test API key. Sign in to see examples pre-filled with your key.
const stripe = require("stripe")("sk_test_51IPpvLGaKmAbY7713DVebrUaPPvLH7OwXMTAI37J3oAtZyFCPgGH6AzUX7i6eNRX3PYuq2FCJh2avyWMvvNYk9UE00WCl373It");


//calculate the amount of stripe payment
// const calculateOrderAmount = items => {
//   return 1000;
// };

//create customer sample list
// const customer_sample = {
//     name:'weisheng',
//     description: 'My First Test Customer (created for API docs)',
//     email:'weisheng@gmail.com',
//     phone:'0192137734',
//     address:{'line1':'332,Jalan E4','line2':'Taman Melawati','city':'Kuala Lumpur','country':'MY','postal_code':'53100','state':'Malaysia'}
// }

//create customer card sample
// const paymentMethod = {
//   type: 'card',
//   card: {
//     number: '4000056655665556',
//     exp_month: 4,
//     exp_year: 2022,
//     cvc: '314',
//   },
// };

//////////////////////
// Customer Stripe API//
/////////////////////

//create the customer with card 
//fire one time to ask customer for register account as stripe  user.
fooder_striperouter.route("/create-stripe-customer").post(auth,(req,res)=>{
  
  const {name,email,phone} = req.body;

  const cust_stripe = {
    name,
    email,
    phone,
    address:{'line1':req.body.address}
  }

  // customer_sample

  stripe.customers.create(cust_stripe,(err,customer)=> {
    if(err) {
      console.log(err);
    } else {
      let token = req.cookies.auth;
      FooderRegister.findByToken(token,(err,user)=>{
        if(err) {
          console.log(err);
        } else {
            FooderRegister.findByIdAndUpdate(user._id,{stripe_id:customer.id},function(err,foodregister){
              if(err) {
                console.log(err);
              } else{  
                res.send({
                  customerId: customer.id,
                });   
            }
          })
          
        }
      })
    } 
  });
});



//get stripe customer by id 
fooder_striperouter.route("/get-customer").get((req,res)=>{
  stripe.customers.retrieve(customer_stripeid,function(err,customer){
    if(err)
    {
        console.log("err: "+err);
    }if(customer)
    {
        res.json({"success": customer});
    }else{
        console.log("Something wrong")
    }
  });  
});

//delete stripe customer list
fooder_striperouter.route("/delete-customer").post((req,res)=>{
  const deletecustomer = stripe.customers.del(customer_stripeid,(err,delcustomer)=>{
    if(err){
      console.log(err);
    } else {
      console.log(delcustomer);
    }
  });
  res.send({
    clientSecret: deletecustomer.client_secret,
    success:"true"
  });
})

//get stripe customer list
fooder_striperouter.route("/get-customer-list").get((req,res)=>{
  console.log(customer_init)
  stripe.customers.list(function(err,customer){
    if(err)
    {
        console.log("err: "+err);
    }if(customer)
    {
        console.log(customer_init)
        res.json({"success": customer});
    }else{
        console.log("Something wrong")
    }
  });  
});


//////////////////////
// Payment Intent Stripe API//
/////////////////////
//create the payment intent stripe
fooder_striperouter.route("/payment-intent").post(auth,(req, res)=>{

  let token = req.cookies.auth;

  const {amount,customer} = req.body;

  FooderRegister.findByToken(token,(err,user)=>{
    if(err) {
      console.log(err);
    } else  {
      FooderRegister.findById(user._id,function(err,carddetails){

        const payment_intent_test = {
          customer, //customer stripe db :carddetails.stripe_id
          amount,
          currency: "myr",
          metadata: {integration_check: 'accept_a_payment'}
        }

        if(err) {
          console.log(err);
        } else {
          stripe.paymentIntents.create(payment_intent_test,(err,paymentintent) => {
            if(err) {
              console.log(err);
            } else{
              res.send({
                clientSecret:paymentintent.client_secret
              });  
            }
          })
        }
      })
    }
  })      
});





//list payment intent stripe
fooder_striperouter.route("/get-payment-intent-list").get((req,res)=>{
  stripe.paymentIntents.list(function(err,paymentintent){
    if(err)
    {
        console.log("err: "+err);
    }if(paymentintent)
    {
        res.json({"success": paymentintent.data});
    }else{
        console.log("Something wrong")
    }
  });  
});


module.exports = fooder_striperouter;
