import React, { Component } from 'react';
import classes from '../../containers/Payment/Payment.module.css';
import {TextField} from '@material-ui/core';


class Payment extends Component {
    render() {
        return (
            <div className={classes.CustomerDetailsBlockSelector }>
                    <form>
                        <div className={classes.CustomerDetailsBlockSelector}>
                            {/* <h2>Billing Details</h2> */}
                            {
                                this.props.paymentAuth === true ? 
                                <div >
                                    <TextField 
                                        required id="full-name" 
                                        label="Full Name" 
                                        variant="outlined"
                                        className={classes.formDetails} 
                                        defaultValue={this.props.fullname}
                                        InputProps={{
                                            readOnly: true,
                                          }}
                                    />
                                    <TextField
                                        required
                                        id="outlined-multiline-static"
                                        label="Street Address"
                                        multiline
                                        rows={2}
                                        placeholder="Street Address"
                                        variant="outlined"
                                        className={classes.formDetails} 
                                        defaultValue={this.props.address.map(faddr=>faddr)}
                                        
                                    />
                                    <div className={classes.FooderForm_HalfField}>
                                        <TextField 
                                            required id="country" 
                                            label="Country" 
                                            variant="outlined"
                                            className={classes.formDetails} 
                                            defaultValue={this.props.country}
                                            InputProps={{
                                                readOnly: true,
                                              }}
                                        />
                                    </div>
                                    <div className={classes.FooderForm_HalfField}>
                                        <TextField 
                                            required id="states" 
                                            label="State/Province" 
                                            variant="outlined"
                                            className={classes.formDetails} 
                                            defaultValue={this.props.state}
                                            InputProps={{
                                                readOnly: true,
                                              }}
                                        />
                                    </div>
                                    <div className={classes.FooderForm_HalfField}>
                                        <TextField 
                                            required id="phonenumber" 
                                            label="Phone Number" 
                                            variant="outlined"
                                            className={classes.formDetails} 
                                            defaultValue={this.props.phonenumber}
                                        />
                                    </div>
                                    <div className={classes.FooderForm_HalfField}>
                                        <TextField
                                            required
                                            id="postcode"
                                            label="Postcode"
                                            className={classes.formDetails} 
                                            variant="outlined"
                                            />
                                    </div>
                                </div> : 
                                <div style={{textAlign: 'center'}}>
                                    <p>Login To Continue</p>
                                </div>
                            }
                            
                        </div>  
                    </form>
            </div>      
        );
    }
}

export default Payment;
