import React, { Component } from 'react';
import classes from '../../containers/FooderType/FooderType.module.css';
import NavBar from '../../components/NavBar/NavBar';
import BannerMain from '../../components/UI/BannerMain/BannerMain';
import axios from 'axios';
import queryString from 'query-string';
import {Link} from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';
import {FaPlus} from "react-icons/fa";
import FormControl from  '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Footer from '../../components/Footer/Footer';
import MasterClasses from '../FooderMaster/FooderMaster.module.css';

class FooderType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fooder_type:[],
            fooder_sortmaindish:"",
            fooder_profile:[]
        };
    }

    componentDidMount(){
        const values = queryString.parse(this.props.location.search)
        axios.get(`/api/fooder_maindish/type?type=` + values.type)
            .then(response => {
                this.setState({
                    fooder_type:response.data
                })    
            }).catch(error =>{
                    this.setState({error:true})
        });
        axios.get('/api/fooder_register/profile')
            .then(response => {
                this.setState({fooder_profile:response.data})
            }).catch(error =>{this.setState({error:true})
        });
    }   

    handleChange = (event) => {
        event.preventDefault();
        let sortgridorder = event.currentTarget.value;
        const foodertype_info = [].concat(this.state.fooder_type);
        // Sort The Data
        if(sortgridorder === 'ascordername'){
            foodertype_info.sort((a,b)=> a.maindish > b.maindish ? 1: -1)
        }
        if(sortgridorder === 'descordername'){
            foodertype_info.sort((a,b)=> a.maindish < b.maindish ? 1: -1)
        }
        if(sortgridorder === 'ascorderprice'){
            foodertype_info.sort((a,b)=> a.baseprice > b.baseprice ? 1: -1)
        }
        if(sortgridorder === 'descorderprice'){
            foodertype_info.sort((a,b)=> a.baseprice < b.baseprice ? 1: -1)
        }
        if(sortgridorder === 'newestorderdate'){
            foodertype_info.sort((a,b)=> a.createdAt < b.createdAt ? 1: -1)
        }
        if(sortgridorder === 'oldestorderdate'){
            foodertype_info.sort((a,b)=> a.createdAt > b.createdAt ? 1: -1)
        }
        
        

        var sorttest = foodertype_info.map((ftype)=>
            <div key={ftype._id} className={classes.cardTypeItem}>
                <img src={`https://ik.imagekit.io/remvql9zt2k1/${ftype.upload_img}`} alt="NasiLemak" className={classes.cardTypeImage}/>
                <h3>{ftype.maindish}</h3>
                <p>{ftype.type}</p>
                <p className={classes.cardTypePriceTag}>RM {ftype.baseprice}</p>
                <Link to={{ pathname: "/foodlist/" + ftype._id }}>
                    <IconButton color="primary" aria-label="redirectfoodurl" className={classes.RedirectFoodIcon} style={{float:"right"}}>
                        <FaPlus />
                    </IconButton>
                </Link>
            </div>)

        this.setState({fooder_sortmaindish:sorttest})
    }

    
    render() {
        return (
            <div className={MasterClasses.FoodMasterBody}>
                <NavBar />  
                <BannerMain />
                {/* Grid */}
                {/* Pagination */}
                {/* SearchBar */}
                    <h1 style={{textAlign: 'center',marginTop:"20px"}}>TYPE</h1>
                    <div className={classes.sortGridType}>
                        <FormControl>
                            <InputLabel htmlFor="sort-type">Sort</InputLabel>
                            <NativeSelect onChange={this.handleChange}>
                                <option aria-label="None" value="" />
                                <option value="ascordername">Name (A-Z)</option>
                                <option value="descordername">Name (Z-A)</option>
                                <option value="ascorderprice">Price (Low To High)</option>
                                <option value="descorderprice">Price (High To Low)</option>
                                <option value="newestorderdate">Newest To Oldest</option>
                                <option value="oldestorderdate">Oldest To Newest</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div className={classes.cardTypeGrid}>
                        {this.state.fooder_sortmaindish}
                        {this.state.fooder_type.map(ftype => 
                            <div key={ftype.maindish} className={classes.cardTypeItem} style={this.state.fooder_sortmaindish ? {display:"none"}:{display:"block"}}>
                                <img src={`https://ik.imagekit.io/remvql9zt2k1/${ftype.upload_img}`} alt="NasiLemak" className={classes.cardTypeImage}/>
                                <h3>{ftype.maindish}</h3>
                                <p>{ftype.type}</p>
                                <p className={classes.cardTypePriceTag}>RM {ftype.baseprice}</p>
                                {
                                    this.state.fooder_profile["isAuth"] === true ?
                                    <Link to={{ pathname: "/foodlist/" + ftype._id }}>
                                        <IconButton color="primary" aria-label="redirectfoodurl" className={classes.FooderTypeIcon}>
                                            <FaPlus />
                                        </IconButton>
                                    </Link> :
                                    <Link to="/login">
                                        <IconButton color="primary" aria-label="redirectfoodurl" className={classes.FooderTypeIcon}>
                                            <LockIcon/>
                                        </IconButton>
                                    </Link>
                                }
                                
                            </div>)}
                    </div>
                <Footer />            
            </div>
        );
    }
}

export default FooderType;