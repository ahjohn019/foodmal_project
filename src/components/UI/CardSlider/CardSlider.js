import Slider from "react-slick";
import React, {Component} from 'react';
import classes from '../../UI/CardSlider/CardSlider.module.css';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import {FaPlus} from "react-icons/fa";
import axios from 'axios';
import {Link} from "react-router-dom";
import LockIcon from '@material-ui/icons/Lock';
import masterClasses from '../../../containers/FooderMaster/FooderMaster.module.css';


function NoneNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "none"}}
        onClick={onClick}
      />
    );
  }
  
function NonePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "none"}}
        onClick={onClick}
      />
    );
}

class cardSlider extends Component {
    constructor(props){
        super(props);
        this.state = {
            foodermaindish:[],
            fooderaddon:[],
            fooder_profile:[]
        };
    }

    componentDidMount(){
        axios.get('/api/fooder_maindish')
            .then(response => {
                this.setState({
                    foodermaindish:response.data
                })    
            }).catch(error =>{
                    this.setState({error:true})
        });

        axios.get('/api/fooder_register/profile')
            .then(response => {
                this.setState({fooder_profile:response.data})
            }).catch(error =>{
                this.setState({error:true})
        });
        
    }

    render()
        {
            const settings = {
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: this.state.foodermaindish.length <= 3 ? this.state.foodermaindish.length : 3, 
                slidesToScroll: this.state.foodermaindish.length <= 3 ? this.state.foodermaindish.length : 3, 
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
                    breakpoint: 768,
                    settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                    nextArrow: <NoneNextArrow />,
                    prevArrow: <NonePrevArrow />
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    nextArrow: <NoneNextArrow />,
                    prevArrow: <NonePrevArrow />
                    }
                }
                ]

            };

            //insert your CSS below
            const StyledSlider = styled(Slider)`
                    .slick-prev:before{
                        color:black;
                        font-size:50px;
                    },
                    .slick-next:before{
                        color:black;
                        font-size:50px;
                    },
                    .slick-track{
                        margin:auto;
                    }
                    
                `
        
        const {foodermaindish} = this.state;
         
        return(
            <div className={classes.cardBestSellerGrid}>
                <div className={classes.cardBestSellerContainer}>
                    <div className={masterClasses.headlineMaster}> 
                        <p>Recommendation from our customer</p>
                        <h1>Best Seller</h1>
                    </div>
                    <StyledSlider {...settings} >                        
                        {
                            foodermaindish.map(f=>
                            <div key={f._id}>
                            <div key={f.maindish} className={classes.cardBestSellerItem}>  
                                <div style={{width:"100%",margin:"auto"}}>
                                    <img src={`https://ik.imagekit.io/remvql9zt2k1/${f.upload_img}`} alt="NasiLemak" className={classes.cardBestSellerImage} />
                                </div>
                                <div >
                                    <h3>{f.maindish}</h3>
                                    <div style={{display:"flex",justifyContent:"space-between"}}>
                                        <p className={classes.cardBestSellerPriceTag}>RM {f.baseprice}</p>
                                        {   
                                            this.state.fooder_profile["isAuth"] === true ?
                        
                                                <Link to={{ pathname: "/foodlist/" + f._id }}>
                                                    <IconButton color="primary" aria-label="redirectfoodurl" className={classes.RedirectFoodIcon}>
                                                        <FaPlus />
                                                    </IconButton>
                                                </Link>
                
                                            :   
                                            
                                            <Link to="/login">
                                                <IconButton aria-label="redirectfoodurl" className={classes.RedirectFoodIcon}>                                
                                                    <LockIcon />           
                                                </IconButton>   
                                            </Link>    
                                            
                                        }
                                        
                                    </div>
                                </div>
                                
                            </div>
                            </div>
                        )}
                        
                    </StyledSlider>
                    </div>            
                    
                </div>
    
        );
    }

}

export default cardSlider;