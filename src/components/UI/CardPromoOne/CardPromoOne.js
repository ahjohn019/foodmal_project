import React, { Component } from 'react';
import classes from '../../UI/CardPromoOne/CardPromoOne.module.css';
import promoLogoOne from '../../../assets/images/promo_logoone.svg';
import Button from '@material-ui/core/Button';

class CardPromoOne extends Component {
    render() {
        return (
            <div className={classes.promoOneContainer}>
                <img src={promoLogoOne} alt="promoLogoOne"></img>
                <div className={classes.promoOneDetails}>
                    <h1>Try Our Special Nasi Lemak</h1>
                    <p>Mixedup with special homemade rice with ikan billis and peanut</p>
                    <Button
                        variant="contained"
                        style={{width: '150px',backgroundColor:'#e8e46e',fontWeight:'700'}}
                    >
                        FIND MORE
                    </Button>
                </div>
            </div>
        );
    }
}

export default CardPromoOne;