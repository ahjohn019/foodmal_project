import React, {Component} from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import FooderMenu from './containers/FooderMenu/FooderMenu';
import FooderMaster from './containers/FooderMaster/FooderMaster';
import FooderOrder from './containers/FooderOrder/FooderOrder';
import FooderType from './containers/FooderType/FooderType';
import FooderRegister from './containers/FooderAccount/FooderRegister';
import FooderLogin from './containers/FooderAccount/FooderLogin';
import FooderProfile from './containers/FooderAccount/FooderProfile';

class App extends Component {


  render (){
    return (
        <Switch>
            <Route exact path="/" component={FooderMaster}/>
            <Route path="/foodertype/type" component={FooderType} />
            <Route path="/foodlist/:_refmaindish" component={FooderMenu} />
            <Route path="/checkout" component={FooderOrder}/>
            <Route path="/register" component={FooderRegister} />
            <Route path="/login" component={FooderLogin} />
            <Route path="/profile" component={FooderProfile} />
        </Switch>   
    );
  }; 
}

export default App;
