import React, { Component } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import classes from '../FooderAccount/FooderAccount.module.css';
import AvatarProfile from '../../assets/images/avatar_profile.png';
import axios from "axios";
import ButtonOrder from '../../components/UI/Button/ButtonOrder';
import { DataGrid } from '@material-ui/data-grid';

class FooderProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fooder_orderList:[],
            fooder_profile:[],
            fooder_profileaddr:[]
        }

        this.orderInfo = this.orderInfo.bind(this);
    }

    componentDidMount() {
        axios.get('/api/fooder_order/order_lists')
            .then(response=>{
                this.setState({fooder_orderList:response.data})
            }).catch(error=>{
                this.setState({error:true})
            })
        axios.get('/api/fooder_register/profile')
            .then(response => {
                this.setState({fooder_profile:response.data, fooder_profileaddr:response.data.address})
            })
            .catch(error=>{
                this.setState({error:true})
        });
    }

    orderInfo = () => {
        const fooder_profileid = this.state.fooder_profile.id;
        let fooder_orderList = this.state.fooder_orderList;
        const fooder_filterMap = fooder_orderList.filter(function(ref){return ref._refprofile === fooder_profileid})
        const row_orderInfo = fooder_filterMap.map(function(order){
            return {id:order._id, orderDate:order.createdAt,orderStatus:order.order_status,orderSubtotal:order.order_subtotal}
        });

        const col_orderList = [
            {field:'id', headerName:'Order Number', width:280},
            {field:'orderDate', headerName:'Created Date', width:180},
            {field:'orderStatus', headerName:'Status', width:150},
            {field:'orderSubtotal', headerName:'Subtotal(RM)', width:200},
            {
                field: "actions",
                headerName: "Actions",
                sortable: false,
                width: 100,
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    return (
                        <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
                            <ButtonOrder index={params.row.id} />
                         </div>
                    );
                 }
              }
        ]

        return {row_orderInfo, col_orderList};
    }


    render() {
        let orderInfo = this.orderInfo();

        return (
            <div>
                <NavBar />
                <div className={classes.Fooder_Profile}>
                    <div className={classes.Fooder_AccountBlock}>
                        <div>
                            <img className={classes.Fooder_AvatarImg} src={AvatarProfile} alt="Avatar_Profile"></img>
                        </div>
                        <h2>{this.state.fooder_profile["name"]}</h2>
                        <p>{this.state.fooder_profile["email"]}</p>
                        {this.state.fooder_profileaddr.map(faddr=><p key={faddr}>{faddr}</p>)}
                        <p className={classes.Fooder_State}>{this.state.fooder_profile["state"]}</p>
                        <p>{this.state.fooder_profile["phonenumber"]}</p>
                    </div>    
                    <div className={classes.Fooder_ProfileOrderBlock}>
                        <h5>Order List</h5>
                        {
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid rows={orderInfo.row_orderInfo} columns={orderInfo.col_orderList} pageSize={5} checkboxSelection />
                            </div> 
                        }
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default FooderProfile;