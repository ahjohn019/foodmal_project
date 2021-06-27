import React, { Component } from 'react';
import classes from './NavBar.module.css';
import NavItem from './NavItem/NavItem';
import ShoppingCartIcon  from '@material-ui/icons/ShoppingCart';
import PersonIcon from '@material-ui/icons/Person';
import Logo from '../Logo/Logo';
import DrawerIcon from './Drawer/Drawer';
import {Link} from "react-router-dom";
import axios from "axios";


class navBar extends Component {

    constructor(props) {
        super(props);
        this.state ={
            fooder_order: [],
            fooder_profile:[],
            fooder_navbarColor:"",
            fooder_navbarItem:"",
            fooder_orderLength:[]
        }
    }

    componentDidMount() {
        axios.get('/api/fooder_order')
            .then(response => {
                //count the awaiting payment status length
                let order_filtersuccess = response.data.filter(fooder=>fooder.order_status !== 'Success')
                this.setState({
                    fooder_order:order_filtersuccess
                })       
            }).catch(error=>{
                this.setState({error:true})
        });

        axios.get('/api/fooder_register/profile')
            .then(response =>{
                this.setState({
                    fooder_profile:response.data
                })
            }).catch(error=>{
                this.setState({error:true})
            });
        
        window.addEventListener("scroll", this.handleScroll)
        
    }

    handleScroll = () =>{
        if (window.pageYOffset > 0) {
            if(!this.state.fooder_navbarColor){
              this.setState({ fooder_navbarColor: "lightseagreen"});   
            } 

        } else {
            if(this.state.fooder_navbarColor){
              this.setState({ fooder_navbarColor: "" });
            }
        }
    }

    handleLogout = () => {
        axios.get('/api/fooder_register/logout')
            .then(response => {
                console.log(response.data)
                window.location.href = '/';
            })
            .catch(error=>{this.setState({error:true})});
    }

    render(){
        let token = this.state.fooder_profile.token;
        let fooder_profileid = this.state.fooder_profile.id;
        let fooder_order = this.state.fooder_order;
        let _gettotalcheckoutdata;

        if(token){
            var fooderOrder_count = 0;
            var fooderOrder_init = [];
            

            for(var i in fooder_order){
                let fooder_orderid = fooder_order[i]._refprofile.toString();
                if(fooder_orderid === fooder_profileid){
                    fooderOrder_count++
                    fooderOrder_init.push(fooderOrder_count)
                    _gettotalcheckoutdata = fooderOrder_init.length 
                }
            }
        }

        if(typeof(_gettotalcheckoutdata) === 'undefined'){
            _gettotalcheckoutdata = this.props.orderCartLength
        }


        return(
            <div className={classes.NavBar} style={{backgroundColor: this.state.fooder_navbarColor}}>
                <NavItem style={{marginTop:" 20px"}}>
                    <div className={classes.dropdown}>
                        <span><PersonIcon style={{fontSize:30}}></PersonIcon></span>
                        <div className={classes.dropdown_content}>
                            { 
                                this.state.fooder_profile.token ?
                                    <div>
                                        <Link to="/profile">
                                            <p>{this.state.fooder_profile['name']}</p>   
                                        </Link>                                     
                                        <p onClick={this.handleLogout}>Logout</p>                                                                                   
                                    </div>
                                :
                                    <div>
                                        <Link to="/login"> 
                                            <p>Login</p>
                                        </Link>
                                        <Link to="/register">
                                            <p>Register</p>
                                        </Link>
                                    </div>
                            }
                        </div>
                    </div>
                </NavItem>
                <Link to={{ pathname : "/checkout"}}>      
                    <div>
                        <NavItem>                                                                
                        <div>
                            <ShoppingCartIcon style={{ fontSize: 30 }}/>
                            <span className={classes.NotificationIcons} style={_gettotalcheckoutdata ? {display:"block",color:"white",fontWeight:"bold"} : {display:"none"}}>
                                {typeof(this.props.orderCartLength) === "undefined" ? _gettotalcheckoutdata : this.props.orderCartLength}
                            </span>
                        </div>                               
                        </NavItem>
                    </div>
                </Link>
                <Link to="/">
                    <Logo />
                </Link>
                <DrawerIcon />
                
            </div>
        );
    }
}


export default navBar;