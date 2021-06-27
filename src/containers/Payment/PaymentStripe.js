import React, { Component } from 'react';
import axios from "axios";
import { CardElement } from "@stripe/react-stripe-js";
import classes from "../Payment/Payment.module.css";


class PaymentStripe extends Component {
    constructor(props){
        super(props);
        this.state={
            fooder_order:[],
            fooderorder_addon: [],
            fooder_profile:[],
            fooder_profileAddr: []
        }    
    }

    componentDidMount(){
        axios.get('/api/fooder_order')
            .then(response => {
                this.setState({
                    fooder_order:response.data
                })
            }).catch(error=>{
                this.setState({error:true})
        });

        axios.get('/api/fooder_order/order_lists')
            .then(response => {
                this.setState({
                    fooder_orderLists:response.data
                })
            }).catch(error=>{
                this.setState({error:true})
        });


        axios.get('/api/fooder_register/profile')
            .then(response=>{
                this.setState({fooder_profile: response.data, fooder_profileAddr: response.data.address})
            }).catch(error=>{
                this.setState({error:true})
            });

    }


     handleSubmit = (event) => {
        event.preventDefault();
        const token = this.state.fooder_profile.token;
        const orderEach = this.state.fooder_order;
        const fooder_profileid = this.state.fooder_profile.id;
        const {stripe, elements} = this.props;
        const cardElement = elements.getElement(CardElement);

        if(token){
            // const fooder_orderid = this.state.fooder_orderLists.map(orderMain => orderMain._refprofile)
            const fooder_subtotal =   this.props.subtotal
            const fooder_stripeamt = this.props.subtotal*100
            var order_filter = orderEach.filter(order => order._refprofile[0] === fooder_profileid && order.order_status === "Pending").map(order => order._id);
            const cust_stripe = {
                name: this.state.fooder_profile["name"],
                email: this.state.fooder_profile["email"],
                phone: this.state.fooder_profile["phonenumber"],
                address: this.state.fooder_profile["address"].toString()
            }
            const stripe_id = this.state.fooder_profile["stripe_id"]

            const pay_success = () => {
                for(var i in order_filter){
                    axios.put(`/api/fooder_order/${order_filter[i]}`,{order_subtotal:fooder_subtotal,order_method:"Card"})
                        .then(function(response) {
                            console.log(response.data);

                        })
                        .catch(err => console.log('Error: ' + err))
                }
                alert("Stripe Payment Success");
                window.location.reload(false);
            }
            
            if(typeof stripe_id === "undefined" || stripe_id.length <= 0 ){
                axios.post('/api/fooder_stripe/create-stripe-customer',cust_stripe)
                    .then(function(response) {
                        console.log(response.data);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });  
            } 

            axios.post('/api/fooder_stripe/payment-intent',{customer: stripe_id,amount: fooder_stripeamt})
                .then(function(response) {
                    (
                        async () => {
                            await stripe.confirmCardPayment(
                                response.data.clientSecret,
                                {
                                    payment_method:{
                                        card: cardElement
                                    }
                                }
                            );
                            pay_success();   
                        }
                    )()    
                })
            .catch(function(error) {
                console.log(error);
            });
                

            
        }
    }



    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <CardElement
                        options={{
                            style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                            },
                        }}
                        />
                    <div className={classes.buttonStripe}>
                        <button type="submit">
                            Pay
                        </button>
                    </div>
                </form>
                
            </div>
        );
    }
}

export default PaymentStripe;