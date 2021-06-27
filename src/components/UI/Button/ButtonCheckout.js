import React, {useState, useEffect} from 'react';
import classes from './ButtonCheckout.module.css';
import {Modal, Button} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FaTimes, FaCheck, FaPlus } from "react-icons/fa";
import axios from 'axios';
import PurchaseButton from '@material-ui/core/Button';


const ButtonConfirmation = (props) => {
        const [show, setShow] = useState(false);
        const [profile, setProfile] = useState(true);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        const listCheckoutDict = props.listCheckoutDict;
        let history = useHistory(); 

        useEffect(() => {
                axios.get('/api/fooder_register/profile')
                    .then(response => {
                        setProfile(response.data);
                    });
                }
        , []);

        const handlecheckout = (event) => {
            var _addon = listCheckoutDict.map(list => list.label);
            const btnValue = event.currentTarget.value;

            const foodCheckoutList = ({
                order_title:props.fooderMaindish,
                order_type:props.fooderType,
                order_addon: _addon,
                order_qty: props.quantity,
                order_price:props.totalPrice,
                order_baseprice:props.fooderbasePrice,
                order_remarks:props.specialInstruction,
                order_status: "Pending",
                order_img:props.fooderImg,
                _refprofile: profile.id
            });

            if(foodCheckoutList.order_remarks === "" ){
                foodCheckoutList.order_remarks = "None"
            }


            if(foodCheckoutList.order_addon.length <= 0 ){
                foodCheckoutList.order_addon = "None"
            }

            if(btnValue === "btnCheckout"){     
                //save order to db
                axios.post('/api/fooder_order/order/add', foodCheckoutList).then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                console.log(error);
                });
                history.push({
                    pathname: '/checkout'
                });
                window.location.reload(false);
                
            }

            if(btnValue === "btnGoBack"){
                history.push('/');
                window.location.reload(false);
                axios.post('/api/fooder_order/order/add', foodCheckoutList).then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                console.log(error);
                });          
            }
        }    

            return(
                <>
                    <div className={classes.ButtonPurchase}>
                        <PurchaseButton
                            variant="contained"
                            color="primary"
                            style={{fontSize:"24px"}}
                            onClick={handleShow}
                        >
                            {props.children}
                        </PurchaseButton>
                    </div>
                    <Modal show={show} 
                        onHide={handleClose} 
                        aria-labelledby="contained-modal-title-vcenter"
                        centered >

                        <div className={classes.ModalHeader}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    <h3 className={classes.ModalTitle}>Here Is Your Order</h3>  
                                </Modal.Title>
                            </Modal.Header>
                        </div>

                        <form onSubmit={handlecheckout}>
                            <div className={classes.ModalContent}>
                                <Modal.Body>
                                        <p>Your Add-On : </p>
                                        <div>
                                            {listCheckoutDict.map(list =>
                                                <div key={list.label}>
                                                    <li>{list.label} <p className={classes.PriceList}>+ {list.price}</p> </li>                                     
                                                </div>
                                            )}
                                        </div>
                                        <br />
                                        <p>Quantity : {props.quantity}</p>
                                        <p>Special Instructions :</p>
                                        <p>{props.specialInstruction}</p>
                                        <p>Total Price: RM {props.totalPrice}</p>
                                        <p>Confirmed Order ?</p>
                                </Modal.Body>   
                            </div>              

                            <div className={classes.ModalFooter}>
                                <Modal.Footer>           
                                    <Button variant="primary" type="submit" value="btnGoBack" onClick={handlecheckout}>
                                        <FaPlus size={24} />
                                    </Button>             
                                    <Button variant="success" type="submit" value="btnCheckout" onClick={handlecheckout}>
                                        <FaCheck size={24} />
                                    </Button>    
                                    <Button variant="danger" onClick={handleClose}>
                                        <FaTimes size={24} />
                                    </Button>     
                                </Modal.Footer>
                            </div>    
                        </form>
                    </Modal>
                </>
            );                                  
};

export default ButtonConfirmation;