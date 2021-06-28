import React, { Component } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import classes from '../../containers/FooderOrder/FooderOrder.module.css';
import Payment from '../Payment/Payment';
import axios from "axios";
import { FormControl, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { FaDollarSign } from "react-icons/fa";
import Button from '@material-ui/core/Button';
import StripeCard from '../../containers/Payment/PaymentStripe';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import masterClasses from '../../containers/FooderMaster/FooderMaster.module.css';
import CheckoutList from '../../components/UI/CheckoutList/CheckoutList';
import Amex from '../../assets/images/amex.svg';
import MasterCard from '../../assets/images/mastercard.svg';
import Visa from '../../assets/images/visa.svg';
import CouponComponent from '../../components/UI/CardCoupon/CardCoupon';


class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fooder_order: [],
            fooderorder_addon: [],
            fooder_profile: [],
            fooder_profileAddr: [],
            fooder_delete: "",
            fooder_paymentMethod: "",
            fooder_stripeid: null,
            fooder_orderMain: [],
            fooder_orderList: []
        }
        this.paymentSuccess = this.paymentSuccess.bind(this);
        this.paymentSelection = this.paymentSelection.bind(this);
    }

    componentDidMount() {
        axios.get('/api/fooder_order')
            .then(response => {
                this.setState({
                    fooder_order: response.data
                })
            }).catch(error => {
                this.setState({ error: true })
            });

        axios.get('/api/fooder_order/order_lists')
            .then(response => {
                this.setState({
                    fooder_orderLists: response.data
                })
            }).catch(error => {
                this.setState({ error: true })
            });

        axios.get('/api/fooder_register/profile')
            .then(response => {
                this.setState({ fooder_profile: response.data, fooder_profileAddr: response.data.address })
            }).catch(error => {
                this.setState({ error: true })
            });

        this.setState({ fooder_stripeid: loadStripe('pk_test_51IPpvLGaKmAbY77189skNT5zTXG8FeVCxTfzqpnmTvRcYscY8q6LvlsIF9XIhdZKMg2NpcfKszix5a5qZhYDGAYf00HwDgWNEC') })
    }

    paymentSelection = (event) => {
        const paymentMethod = event.target.value;
        this.setState({ fooder_paymentMethod: paymentMethod })
    }

    paymentSuccess = (event) => {
        const token = this.state.fooder_profile.token;
        const orderEach = this.state.fooder_order;
        const fooder_profileid = this.state.fooder_profile.id;
        const orderSubtotal = event.currentTarget.value;
        const { fooder_paymentMethod } = this.state;
        var order_filter = orderEach.filter(order => order._refprofile[0] === fooder_profileid && order.order_status === "Pending").map(order => order._id);

        //add payment order to db after user select order

        if (token) {
            const fooder_orderstatus = this.state.fooder_orderLists.map(orderMain => orderMain._order_status)

            if (fooder_paymentMethod === "cash") {
                for (var i in order_filter) {
                    axios.put(`/api/fooder_order/${order_filter[i]}`, { order_subtotal: orderSubtotal, order_method: "Cash" })
                        .then(function (response) {
                            console.log(response.data);
                        })
                        .catch(err => console.log('Error: ' + err))
                }
            }

            //order status = "Success" => instant delete
            if (fooder_orderstatus !== "Success") {
                const filterSuccess = this.state.fooder_order.filter(fsuccess => fsuccess.order_status === 'Success');
                this.setState({ fooder_order: filterSuccess })
                alert("Order Success");
            }
        } else {
            alert("Not authorized to update other order.")
        }
    }

    deleteCheckoutHandler = (event) => {
        event.preventDefault();
        let _checkoutDeleteButtonId = event.currentTarget.value

        //delete data from db
        axios.delete(`/api/fooder_order/${_checkoutDeleteButtonId}`)
            .then(res => {
                console.log(res.data);
            });


        const deleteCheckout = this.state.fooder_order.filter(fdelete => fdelete._id !== _checkoutDeleteButtonId);
        this.setState({ fooder_order: deleteCheckout })
    }

    getTotalPrice = () =>
    {
        let token = this.state.fooder_profile.token
        let fooder_profileid = this.state.fooder_profile.id
        let _gettotalprice;
        let filterSuccess = this.state.fooder_order.filter(fsuccess => fsuccess.order_status !== 'Success')
        let filterSuccessLength;
        let _converttotalprice;

        //old db count cart        
        if (token) {
            //db get total pricetest
            _converttotalprice = filterSuccess.map(forder => fooder_profileid === forder._refprofile[0] ? forder.order_price : null).reduce((sum, index) => sum + index, 0);
            _gettotalprice = _converttotalprice.toFixed(2);
            //Order Status != "Success" => zero
            var fooderOrder_count = 0;
            var fooderOrder_init = [];
            if (token) {
                for (var i in filterSuccess) {
                    if (fooder_profileid === filterSuccess[i]._refprofile.toString()) {
                        fooderOrder_count++
                        fooderOrder_init.push(fooderOrder_count)
                        filterSuccessLength = fooderOrder_init.length
                    }
                }
            }
        } else {
            _gettotalprice = 0
        }

        return {filterSuccess, _gettotalprice, filterSuccessLength}
    }

    getCouponInfo = () => {
        var getTotalPrice = this.getTotalPrice()
        let getCouponInfo
        let convertCouponInfo
        let _gettotalprice = getTotalPrice._gettotalprice
        let _getDiscountInfo
        let _convertDiscountInfo

        if (document.cookie.indexOf('couponDiscount') > -1 ) {
            getCouponInfo = document.cookie.split('; ').find(row => row.startsWith('coupon=')).split('=')[1];
            convertCouponInfo = JSON.parse(getCouponInfo)
            if(convertCouponInfo.cpn_type === 'discount'){
                _convertDiscountInfo = (100-convertCouponInfo.cpn_value)/100 * _gettotalprice
            }
            if(convertCouponInfo.cpn_type === 'fixed'){
                _convertDiscountInfo = _gettotalprice - convertCouponInfo.cpn_value
            }
            _getDiscountInfo = _convertDiscountInfo.toFixed(2)
        } else {
            _getDiscountInfo = _gettotalprice
        }

        return {_getDiscountInfo,convertCouponInfo};
    }


    render() {
        var _getSubtotal = this.getTotalPrice()
        var _getCouponInfo = this.getCouponInfo()

        const InjectedCheckoutForm = () => {
            return (
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        <StripeCard elements={elements} stripe={stripe} subtotal={_getCouponInfo._getDiscountInfo} />
                    )}
                </ElementsConsumer>
            );
        };
        return (
            <div className={masterClasses.FoodMasterBody}>
                <NavBar orderCartLength={typeof (_getSubtotal.filterSuccessLength) === 'undefined' ? null : _getSubtotal.filterSuccessLength} />
                <div className={classes.CheckoutBody}>
                    <div className={classes.CheckoutContainer}>
                        <CheckoutList
                            _filterSuccess={_getSubtotal.filterSuccess}
                            _fooderprofile={this.state.fooder_profile.token}
                            _fooderprofileid={this.state.fooder_profile.id}
                            _filterSuccessLength={_getSubtotal.filterSuccessLength}
                            _deleteCheckoutHandler={this.deleteCheckoutHandler}
                            _totalPrice={_getCouponInfo._getDiscountInfo}
                        />
                        <CouponComponent _totalPrice={_getCouponInfo._getDiscountInfo} />
                    </div>
                    <div className={classes.PaymentMainBlock}>
                        <Payment
                            paymentAuth={this.state.fooder_profile["isAuth"]}
                            profileId={this.state.fooder_profile["id"]}
                            fullname={this.state.fooder_profile["name"]}
                            email={this.state.fooder_profile["email"]}
                            dob={this.state.fooder_profile["dob"]}
                            address={this.state.fooder_profileAddr}
                            state={this.state.fooder_profile["state"]}
                            country={this.state.fooder_profile["country"]}
                            phonenumber={this.state.fooder_profile["phonenumber"]}
                            orderSubtotal={_getCouponInfo._getDiscountInfo}
                            paymentSuccess={this.paymentSuccess}
                        />


                        <div className={classes.fooderPaymentMethod}>
                            <div>
                                <FormControl component="fieldset" style={{ marginTop: "5%" }}>
                                    <RadioGroup aria-label="gender" name="gender1" >
                                        <FormControlLabel value="cash" control={<Radio />} label="Cash-In-Delivery" onClick={this.paymentSelection} />
                                        <div className={classes.PaymentCardContainer}>
                                            <FormControlLabel value="card" control={<Radio />} label="Credit Card" onClick={this.paymentSelection} />
                                            <div style={{ display: "flex", width: "35px" }}>
                                                <img src={Amex} alt="amex" width="100%"></img>
                                                <img src={Visa} alt="visa" width="100%"></img>
                                                <img src={MasterCard} alt="mastercard" width="100%"></img>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div style={{ width: " 100%" }}>
                                {
                                    this.state.fooder_paymentMethod === 'card' ?
                                        <Elements stripe={this.state.fooder_stripeid}>
                                            <InjectedCheckoutForm />
                                        </Elements> :

                                        <div className={classes.fooderOrderButton}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                startIcon={<FaDollarSign />}
                                                onClick={this.paymentSuccess}
                                                value={_getCouponInfo._getDiscountInfo}
                                            >
                                                ORDER
                                            </Button>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Checkout;

