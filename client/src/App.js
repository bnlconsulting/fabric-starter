//REACT
import React, { Component } from 'react';

//REDUX
import history from './redux/history';

//INTERNAL
import './App.css';
import ProtectedRoute from "./containers/ProtectedRoute";
import Login from "./containers/Login";

//REACT ROUTER
import { Router, Route, Switch } from "react-router-dom";

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
