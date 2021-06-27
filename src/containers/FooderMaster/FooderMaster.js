import React, { Component, Suspense, lazy } from 'react';
import classes from '../../containers/FooderMaster/FooderMaster.module.css';

const NavBar = lazy(()=> import('../../components/NavBar/NavBar'));
const BannerMain = lazy(()=> import('../../components/UI/BannerMain/BannerMain'));
const CardCategory = lazy(()=> import('../../components/UI/CardCategory/CardCategory'));
const CardSlider = lazy(()=> import('../../components/UI/CardSlider/CardSlider'));
const CardMainBenefit = lazy(()=> import('../../components/UI/CardMainBenefit/CardMainBenefit'));
const CardPromoOne= lazy(()=> import('../../components/UI/CardPromoOne/CardPromoOne'));
const Footer = lazy(()=> import('../../components/Footer/Footer'));


class FooderMaster extends Component {
    constructor(props){
        super(props);
        this.state = {
            foodercheckout:[],
            fooderid:[],
            foodernavbar:""
        };
    }

    render() {
        return (
            <div className={classes.FoodMasterBody}>
                <Suspense fallback={<div/>}>
                    <NavBar />
                </Suspense>
                    <>
                        <Suspense fallback={<div/>}>
                            <BannerMain />                       
                            <CardCategory />                         
                            <CardSlider />   
                            <CardPromoOne />
                            <CardMainBenefit />
                        </Suspense> 
                    </>
                <Suspense fallback={<div/>}>
                    <Footer />
                </Suspense>
            </div>
        );
    }
}

export default FooderMaster;