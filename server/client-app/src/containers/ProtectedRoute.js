//REACT
import React, { Component } from 'react';

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from "../redux/actions";
import history from '../redux/history';

//antD
import {Layout } from 'antd';

//INTERNAL
import HealthProviders from "./HealthProviders";
import HealthProvidersEditor from "./HealthProvidersEditor";
import HealthProvidersHistory from "./HealthProvidersHistory";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

//REACT ROUTER
import {Router, Route, Switch, Redirect} from "react-router-dom";

const { Content, Sider} = Layout;

class ProtectedRoute extends Component {
    render() {
        return this.props.jwtToken !== null ? (
            <Layout style={{height: '100%'}}>
                <Header />
                <Layout style={{height: '100%'}}>
                    <Sider width="220">
                        <SideMenu/>
                    </Sider>
                    <Content style={{height: '100%'}}>
                        <div style={{margin:10 + 'px'}}>
                            <Router history={history} >
                                <Switch>
                                    <Route exact path="/healthProviders" component={HealthProviders}/>
                                    <Route exact path="/healthProviders/edit/:id" component={HealthProvidersEditor}/>
                                    <Route exact path="/healthProviders/create" component={HealthProvidersEditor}/>
                                    <Route exact path="/healthProviders/history" component={HealthProvidersHistory}/>

                                </Switch>
                            </Router>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: this.props.location }
            }}/>
        );
    }
}


function mapStoreToProps(store, props) {
    return {
        jwtToken:store.user.jwtToken
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(ProtectedRoute);