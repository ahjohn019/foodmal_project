import React, { Component } from 'react';
import classes from '../CheckoutList/CheckoutList.module.css';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
class checkoutlist extends Component {
    
    render() {
        return (
            <div className={classes.CheckoutBlockSelector}>
                {
                    typeof(this.props._filterSuccessLength) === 'undefined' ?
                    <p className={classes.CheckoutNoOrder}><ErrorOutlineIcon />You Have No Place Order</p> : 
                    
                    <div className={classes.orderContainer}>              
                        <h2>Order Summary</h2>
                        {
                            this.props._filterSuccess.map((morder) => this.props._fooderprofileid === morder._refprofile[0] ?
                                    <div key={morder._id} className={classes.orderContainerList}>
                                        <div className={classes.fooderBlockImg}>
                                            <img src={`https://ik.imagekit.io/remvql9zt2k1/${morder.order_img}`} alt="NasiLemak" className={classes.fooderCheckoutImg}/>
                                        </div>
                                        <div className={classes.orderContainerDetails}>
                                            <span className={classes.checkoutTitle}>{morder.order_title}</span>
                                            <div className={classes.orderContainerSubDetails}>
                                                <span >x{morder.order_qty} RM {morder.order_baseprice}</span>
                                                {morder.order_addon.map((fadd) => <span>{fadd}</span>)} 
                                                <label title={morder.order_remarks} className={classes.orderRowRemarks}>{morder.order_remarks}</label>
                                            </div>
                                        </div>
                                        <div className={classes.orderContainerSubtotal}>
                                            <span style={{margin:"auto"}}>RM {morder.order_price}</span>
                                            <IconButton color="primary" aria-label="redirectfoodurl" type="submit"  onClick={this.props._deleteCheckoutHandler} value={morder._id}>
                                                <DeleteIcon style={{color:"black"}}/>
                                            </IconButton> 
                                        </div>
                                    </div>
                            : null
                        )}
                    </div>
                } 

                {
                    typeof(this.props._filterSuccessLength) === 'undefined' ? null : 
                        <div className={classes.fooderSubtotal}>
                            <p>Subtotal</p>
                            <span>RM {this.props._totalPrice}</span>
                        </div>
                }
            </div>
        );
    }
}

export default checkoutlist;