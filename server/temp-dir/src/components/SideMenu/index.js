import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Menu} from 'antd';

import { Link } from 'react-router-dom'

import * as actions from '../../redux/actions';
import './index.css';

class SideMenu extends Component {
    render() {



        const menu = (
            <Menu style={{height: '100%'}}
                className="SideMenu"
                mode="vertical"  >
                <Menu.Item key="Providers"><Link  to="/healthProviders">Providers</Link></Menu.Item>
                <Menu.Item key="Create"><Link  to="/healthProviders/create">Create</Link></Menu.Item>
                <Menu.Item key="History"><Link  to="/healthProviders/history">Transaction History</Link></Menu.Item>


            </Menu>
        );

        return (
            menu
        );
    }
}

function mapStoreToProps(store, props) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStoreToProps, mapDispatchToProps)(SideMenu);
