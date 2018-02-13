import React, { Component } from 'react';
import {Router, Route, Switch} from "react-router-dom";
import history from './redux/history';


import './App.css';

import ProtectedRoute from "./containers/ProtectedRoute";
import Login from "./containers/Login";

class App extends Component {
    render() {
        return (
            <Router history={history} >
                <Switch>
                    <Route exact path="/login" component={Login}/>
                    <Route component={ProtectedRoute}/>
                </Switch>
            </Router>

        );
    }
}

export default App;
