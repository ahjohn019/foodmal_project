import React, { Component } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import classes from '../../containers/FooderAccount/FooderAccount.module.css';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Footer from '../../components/Footer/Footer';
import masterClasses from '../../containers/FooderMaster/FooderMaster.module.css'; 


class FooderRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fooder_checkout:[],
            message_status:[],
            message_validateError:"",
            message_passwordMismatch:"",
            first_name:"",
            last_name:"",
            email:"",
            dob:"",
            address:"",
            state:"",
            country:"",
            password:"",
            password_confirmation:"" };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        axios.get('/api/fooder_checkout')
            .then(response => {
                this.setState({
                    fooder_checkout:response.data
                })          
            }).catch(error=>{
                this.setState({error:true})
        });
    }   

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = (event) => {
        const {first_name, last_name, email,dob,address, state, country, password,password_confirmation} = this.state;
        const food_register = ({
            first_name: first_name,
            last_name: last_name,
            email: email,
            dob: dob,
            address:address,
            states:state,
            country: country,
            password: password,
            password_confirmation: password_confirmation
        })

        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
        
        axios.post('/api/fooder_register/add',
            food_register
        ,
            {withCredentials: true}
        )
        .then(response => {
            this.setState({message_status:response.data,message_validateError:response.status})
            if(response.data["success"] === true){
                sleep(1500).then(() => this.props.history.push('/login'))
            }
        })
        .catch(error => {   
            this.setState({message_status:error.response.data.errors, message_validateError:error.response.status, message_passwordMismatch:error.response.data})
        });
        event.preventDefault();
    }


    render() {
        const _gettotalcheckoutdata = this.state.fooder_checkout.length; 
        const messageBox = 
            this.state.message_validateError === 200 ?
            <MuiAlert elevation={6} variant="filled" severity="success">Registration Successfully</MuiAlert> :
            this.state.message_validateError === 422 ?
            <MuiAlert elevation={6} variant="filled" severity="error">{this.state.message_status.map(err=><p key={err.param}>{err.msg}</p>)}</MuiAlert> :
            this.state.message_validateError === 400 ?
            <MuiAlert elevation={6} variant="filled" severity="error">{this.state.message_passwordMismatch["message"]}</MuiAlert> : 
            null;  

        return (
            <div className={masterClasses.FoodMasterBody}>
                <NavBar countCheckoutItem={_gettotalcheckoutdata}/>
                <div className={classes.FooderAccountContent}>
                    {messageBox}
                    <h2>REGISTER</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className={classes.FooderForm_Group}>
                                <div className={classes.FooderForm_Field}>
                                    <TextField
                                        id="first_name"
                                        label="First Name"
                                        placeholder="Your Name"
                                        multiline
                                        variant="outlined"
                                        style={{width:'240px'}}
                                        
                                        name="first_name"
                                        value={this.state.first_name}
                                        onChange={this.handleChange}
                                        />
                                </div>
                                <div className={classes.FooderForm_Field}>
                                    <TextField
                                        id="last_name"
                                        label="Last Name"
                                        placeholder="Your Name"
                                        multiline
                                        variant="outlined"
                                        style={{width:'240px'}}
                                        name="last_name"
                                        value={this.state.last_name}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className={classes.FooderForm_Group}>
                                <div className={classes.FooderForm_Field}>
                                    <TextField
                                        id="email"
                                        label="Email"
                                        placeholder="Your Email"
                                        multiline
                                        variant="outlined"
                                        className={classes.Fooder_TextField}
                                        style={{width:'240px'}}
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className={classes.FooderForm_Field}>
                                    <TextField
                                        id="dob"
                                        label="Dob"
                                        placeholder="Date Of Birth"
                                        multiline
                                        variant="outlined"
                                        className={classes.Fooder_TextField}
                                        style={{width:'240px'}}
                                        name="dob"
                                        value={this.state.dob}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div> 
                            <div className={classes.FooderForm_Group}>
                                <div className={classes.FooderForm_Field}>
                                    <TextField
                                        id="address"
                                        label="Address"
                                        placeholder="Your Address"
                                        multiline
                                        variant="outlined"
                                        className={classes.Fooder_TextField}
                                        name="address"
                                        value={this.state.address}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div> 
                            <div className={classes.FooderForm_Group}>
                                <div className={classes.FooderForm_Field}>
                                    <TextField
                                        id="state"
                                        label="State"
                                        placeholder="Your State"
                                        multiline
                                        variant="outlined"
                                        className={classes.Fooder_TextField}
                                        style={{width:'240px'}}
                                        name="state"
                                        value={this.state.states}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className={classes.FooderForm_Field}>
                                    <TextField
                                        id="country"
                                        label="Country"
                                        placeholder="Your Country"
                                        multiline
                                        variant="outlined"
                                        className={classes.Fooder_TextField}
                                        style={{width:'240px'}}
                                        name="country"
                                        value={this.state.country}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className={classes.FooderForm_Group}>
                                <div className={classes.FooderForm_Field}>
                                    <TextField ref='password'
                                        label="Password"
                                        placeholder="Your Password"
                                        variant="outlined"
                                        type="password"
                                        className={classes.Fooder_TextField}
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.handleChange} 
                                    />
                                </div>         
                            </div> 
                            <div className={classes.FooderForm_Group}>
                                <div className={classes.FooderForm_Field}>
                                <TextField ref='password_confirmation'
                                    label="Password Confirmation"
                                    placeholder="Your Password Confirmation"
                                    variant="outlined"
                                    type="password"
                                    className={classes.Fooder_TextField}
                                    name="password_confirmation"
                                    value={this.state.password_confirmation}
                                    onChange={this.handleChange}  
                                />
                                 </div>        
                            </div>      

                            <div className={classes.FooderAccountLogin}>
                                <Button variant="contained" color="primary" type="submit">Submit</Button>  
                            </div>    
                            
                        </form>
                    </div>
                    <Footer />
                </div>
            
        );
    }
}

export default FooderRegister;