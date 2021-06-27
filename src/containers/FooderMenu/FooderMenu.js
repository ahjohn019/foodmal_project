import React, { Component } from 'react';
import classes from './FooderMenu.module.css';
import NavBar from '../../components/NavBar/NavBar';
import Button from '../../components/UI/Button/ButtonCheckout';
import Footer from '../../components/Footer/Footer';
import axios from "axios";
import {TextField} from '@material-ui/core';
import {Checkbox, FormControlLabel} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import masterClasses from '../../containers/FooderMaster/FooderMaster.module.css'; 

class NasiBuilder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            showQuantity: true,
            checkoutLabel: [],
            checkoutPrice : [],
            specialInstruction : "",
            charLeft: 50,
            maxChar: 50,
            fooder_menu:[],
            fooder_maindish:[],
            fooder_baseprice:"",
            message_status:"",
            fooder_addon:[]
        };
    }

    componentDidMount(){
        const fooder_id = this.props.match.params._refmaindish

        axios.get(`/api/fooder_addon/${fooder_id}`)
            .then(response => {
                this.setState({fooder_menu:response.data});
            }).catch(error=> {
                this.setState({error:true})
        })

        axios.get(`/api/fooder_maindish/${fooder_id}`)
            .then(response => {
                this.setState({fooder_maindish:response.data,fooder_baseprice:response.data["baseprice"],fooder_addon:response.data._refaddon});
            }).catch(error=> {
                this.setState({error:true})
        })

    }

    //get base price + addon price(by users)
    //if tick => add into base price else remove addon prices
    checkboxIncrement = (event) => {
        const pricelabel = event.target.id;
        const pricevalue = event.target.value;
        const isChecked = event.target.checked;
        let checkoutLabel = [...this.state.checkoutLabel, pricelabel];
        let checkoutPrice = [...this.state.checkoutPrice, pricevalue];
        let {fooder_baseprice} = this.state; 

        if(isChecked){
            fooder_baseprice += parseFloat(pricevalue) ; 
        } else {
            fooder_baseprice -= parseFloat(pricevalue) ;  
            checkoutLabel = checkoutLabel.filter(checklist => checklist !== pricelabel);  
        } 

        this.setState({fooder_baseprice, pricelabel: pricelabel, checkoutLabel: checkoutLabel, checkoutPrice: checkoutPrice});
    }


    handlequantityIncrement = () => {
        // add quantity value on food checkbox
        this.setState({quantity: this.state.quantity + 1});
    }

    handlequantityDecrement = () => {
        if(this.state.quantity > 1){
            this.setState({quantity: this.state.quantity - 1});
        }
    }

    textareaValueEvent = (event) => {
        let specialInstruction = event.target.value;
        let charCount = specialInstruction.length;
        let maxChar = this.state.maxChar;
        let charLeft = maxChar - charCount;

        this.setState({specialInstruction: specialInstruction, charLeft: charLeft});
    }


    render() {
        //quantity of food base on normal price
        var totalPrice;
        let checkoutLabel = this.state.checkoutLabel;
        let checkoutPrice = this.state.checkoutPrice;
        let basePrice = this.state.fooder_baseprice;
        let quantity = this.state.quantity;
        let specialInstruction = this.state.specialInstruction;
        let fooder_addon = this.state.fooder_addon;
        const maxChar = this.state.maxChar;

        //total price of ingredients
        totalPrice = basePrice * quantity;

        //dict list of checkout items
        var listCheckoutDict = checkoutLabel.map(function(key,index){
            return {label:key, price:checkoutPrice[index]}
        });


        return (
            <div className={masterClasses.FoodMasterBody}>
                <NavBar />  
                <div className={classes.BlockContent}>
                    <div className={classes.BlockImagePosition}>
                        <img src={`https://ik.imagekit.io/remvql9zt2k1/${this.state.fooder_maindish["upload_img"]}`} alt="NasiLemak" className={classes.BlockImage}/>
                    </div>
                    <div className={classes.BlockSelectionDetails}>
                        <div className={classes.BlockSelector}>
                            <h5>{this.state.fooder_maindish["maindish"]}</h5>

                            {this.state.fooder_maindish["description"] === "" ? 
                            <p className={classes.BlockWarningMessage}>No Message Available</p> :
                            <p>{this.state.fooder_maindish["description"]}</p>}
                        </div>     
                        
                        {/* Reusable Component */}       
                        <div className={classes.BlockSelector} >
                            <h5>Quantity</h5>
                            <div className={classes.BlockAdjustSelector}>
                                <div className={classes.ButtonQuantityLeft}>
                                    <Fab color="primary" aria-label="add" onClick={this.handlequantityDecrement} size="small">
                                        <RemoveIcon />
                                    </Fab>
                                </div>
                                <div className={classes.ButtonQuantityText}>
                                    {this.state.showQuantity ? <h2>{this.state.quantity}</h2> : ""}
                                </div>
                                <div className={classes.ButtonQuantityRight}>
                                <Fab color="primary" aria-label="add" onClick={this.handlequantityIncrement} size="small">
                                    <AddIcon />
                                </Fab>
                                </div>
                            </div>
                        </div>

                        <div className={classes.BlockSelector}>
                            <h5>Side Dishes</h5>
                            {
                                fooder_addon.length <= 0 || fooder_addon[0] === null ?
                                <p className={classes.BlockWarningMessage}>Not Available</p> :                           
                                fooder_addon.map(fadd =>
                                    <div key={fadd.addon} className={classes.checkboxOne}>
                                        <span>
                                            <FormControlLabel
                                            control=
                                            {
                                                <Checkbox
                                                id={fadd.addon}
                                                name="choice"
                                                value={fadd.price_addon}
                                                onChange={this.checkboxIncrement} 
                                                label={fadd.addon}
                                                />
                                            }
                                            />
                                        </span>
                                        <label>{fadd.addon} </label>   
                                        <p className={classes.BlockLabelPrice}>RM {fadd.price_addon}</p>         
                                    </div>
                                )
                            }
                            
                        </div>

                    {/* Reusable Component */}            
                    <div className={classes.BlockSelector} >
                        <h5>Remarks</h5>
                            <TextField
                                required
                                id="outlined-multiline-static"
                                label="Special Instructions"
                                multiline
                                rows={4}
                                placeholder="Exp: No Vegetables..."
                                variant="outlined"
                                className={classes.SpecialInstructions}
                                value={specialInstruction} 
                                onChange={this.textareaValueEvent}
                                inputProps={{ maxLength: maxChar }}
                                
                            />
                        <br/>
                        <p className={classes.CharLeft}> {this.state.charLeft} words remaining</p>
                    </div>
                    </div>
                </div>
                <Footer>
                    <Button 
                        fooderMaindish={this.state.fooder_maindish["maindish"]}
                        fooderType={this.state.fooder_maindish["type"]}
                        fooderbasePrice={this.state.fooder_maindish["baseprice"]}
                        fooderImg={this.state.fooder_maindish["upload_img"]}
                        totalPrice={totalPrice} 
                        quantity={quantity}  
                        listCheckoutDict={listCheckoutDict}
                        specialInstruction={specialInstruction}
                    >
                        RM {totalPrice} 
                    </Button> 
                </Footer>
            </div>
        );
    }
}

export default NasiBuilder