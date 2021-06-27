import React, { Component } from 'react';
import Slider from "react-slick";
import classes from '../../UI/CardMainBenefit/CardMainBenefit.module.css';
import CookingIcon from '../../../assets/images/cooking_master.png';
import SmileIcon from '../../../assets/images/smile_master.png';
import PromotionIcon from '../../../assets/images/promotion_master.png';


class CardMainBenefit extends Component {
    render() 
        {
            var settings = {
              dots: true,
              infinite: true,
              slidesToShow: 3,
              slidesToScroll: 3,
              initialSlide: 0,
              autoplay: true,
              speed: 2000,
              autoplaySpeed: 3000,
              pauseOnHover: true,
              responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
            };

        
        return (
            <div className={classes.FoodMasterBlockSelectorTwo}>
                <div className={classes.FoodMasterBenefitTitle}>
                  <p>Benefit</p>
                  <h3>Why Choose Our Service</h3>
                </div>
                <Slider {...settings}>
                <div className={classes.FoodFeaturesDesc}>
                    <img src={PromotionIcon} alt="PromotionIcon"  className={classes.FoodMasterDisplayImage}/>
                    <p>Weekly Promotion</p>
                </div>
                    
                <div className={classes.FoodFeaturesDesc}>
                    <img src={CookingIcon} alt="CookingIcon" className={classes.FoodMasterDisplayImage}/>
                    <p>100% Homemade Cooking</p>
                </div>
                <div className={classes.FoodFeaturesDesc}>
                    <img src={SmileIcon} alt="SmileIcon" className={classes.FoodMasterDisplayImage}/>
                    <p>Recommended By Our Customer</p>
                </div>
                
                </Slider>
            </div>
        );
    }
}

export default CardMainBenefit;