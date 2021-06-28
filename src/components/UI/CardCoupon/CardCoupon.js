import React, { useState, useEffect } from 'react';
import classes from '../CardCoupon/CardCoupon.module.css';
import axios from 'axios';



function CouponComponent(props){
    const [couponid, setCouponId] = useState([]);
    const [couponName, setCouponName] = useState("");

    useEffect(() => {
        axios.get('/api/fooder_coupon')
            .then(response => {
                var coupon_filter = response.data.filter(c =>c.cpn_name === couponName).map(c => c._id);
                if(coupon_filter.length > 0) {
                    axios.get(`/api/fooder_coupon/${coupon_filter[0]}`).then(response => {
                        setCouponId(response.data);
                    })
                }           
            })
    }, [couponName]);

  
    if(couponid.length !== 0){
        document.cookie = "coupon="+JSON.stringify(couponid);
        const getCouponValue = document.cookie.split('; ').find(row => row.startsWith('coupon=')).split('=')[1];
        const convertCoupon = JSON.parse(getCouponValue)
        let coupon_discount
        if(convertCoupon.cpn_type === 'discount'){
            coupon_discount =  (100-convertCoupon.cpn_value)/100 * props._totalPrice
        }
        if(convertCoupon.cpn_type === 'fixed'){
            coupon_discount = props._totalPrice - convertCoupon.cpn_value
        }
        document.cookie = "couponDiscount=" + coupon_discount;
    }

    
    const cancelCoupon = () => {
        const clearCoupon = ['couponDiscount','coupon']
        for(var i in clearCoupon){
            document.cookie = clearCoupon[i] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        return document.cookie
    }
    
    return (
        <div className={classes.couponBody}>
            <form className={classes.couponDetails}>
                <label>Discount Code</label>
                <div className={classes.couponDetailsInput}>  
                    <div style={{display: 'flex'}}>
                        <input type="text" value={couponName} onChange={event => setCouponName(event.target.value)} style={{width:'100%'}} />
                        {
                            document.cookie.indexOf('coupon') > -1 ? 
                            <div style={{display: 'flex'}}>
                                <input type="submit" value="Submit" />
                                <input type="submit" value="Cancel" onClick={cancelCoupon}/>
                                {/* <span>{couponid.cpn_name}</span> */}
                            </div>
                            : null
                        }
                    </div>
                </div>
            </form>
        </div>
    );
};


export default CouponComponent ;