
import React from 'react';
import classes from '../BannerMain/BannerMain.module.css';
import BannerLogoOne from '../../../assets/images/fooder_banner_logoone.svg';
import Button from '@material-ui/core/Button';

const BannerMain = (props) => {
    return(
        <div className={classes.FooderBanner}>
            <div className={classes.FooderBannerText}>
                <h2>FOODER MALAYSIA</h2>
                <p>EAT MORE PAY LESS</p>
                <div className={classes.FooderBannerButton}>
                    <Button
                        variant="contained"
                        style={{width: '100px',backgroundColor:'#e8e46e',fontWeight:'700'}}
                    >
                        EXPLORE
                    </Button>
                </div>
            </div> 
            <div className={classes.FooderBannerLogoOne}>
                <img src={BannerLogoOne} alt="BannerLogoOne" ></img>
            </div>
        </div>
    );
}

export default BannerMain;