import React, { Component } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import classes from '../../containers/FooderAccount/FooderAccount.module.css';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Footer from '../../components/Footer/Footer';
import masterClasses from '../../containers/FooderMaster/FooderMaster.module.css'; 

class FooderLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fooder_checkout: [],
            email:"",
            password:"",
            message_status:""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = (event) =>{
        const {email,password} = this.state;
        const food_login = ({
            email: email,
            password: password
        })

        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        axios.post('api/fooder_register/login',food_login,
            {withCredentials: true}
        )
        .then(response => {
            if(response.status === 200){
                this.setState({message_status:response.data})
                if(response.data["isAuth"] === true){
                    sleep(1000).then(() => this.props.history.push('/'))
                }
            }
        })
        .catch(error => {
            this.setState({message_status:error.message})
        });

        event.preventDefault();
    }

    render() {
        const messageBox = this.state.message_status["isAuth"] === true ? 
            <MuiAlert elevation={6} variant="filled" severity="success">Login Successfully</MuiAlert> :
            this.state.message_status["isAuth"] === false ?
            <MuiAlert elevation={6} variant="filled" severity="error">{this.state.message_status['message']}</MuiAlert> :
            null;

        return (
            <div className={masterClasses.FoodMasterBody}>
                <NavBar />
                <div className={classes.FooderAccountContent}>
                    <form onSubmit={this.handleSubmit} style={{margin:"auto"}}>
                        {messageBox}
                        <h2>LOGIN</h2>
                            <div className={classes.FooderForm_Group}>
                                <div className={classes.FooderForm_Field}>
                                        <TextField
                                            id="email"
                                            label="Email"
                                            placeholder="Your Email"
                                            multiline
                                            variant="outlined"
                                            className={classes.Fooder_TextField}
                                            name="email"
                                            value={this.state.email}
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

export default FooderLogin;