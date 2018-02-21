import './index.css';
import React, {Component} from 'react';
import logo from '../../logo.svg';

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from "../../redux/actions";

import { Layout, Select, Button, Spin, Row, Col, Menu, Dropdown, Icon} from 'antd';
const { Header:LayoutHeader } = Layout;
const { Option } = Select;
const SubMenu = Menu.SubMenu;


class Header extends Component {

    componentDidMount (){
        this.props.actions.getConfig();
    }

    render() {
        let menu = (
            <Menu onClick={this.props.actions.logout}>
                <Menu.Item key="1">Logout</Menu.Item>
            </Menu>
        );

        return (
            <LayoutHeader>
                <div className="logo">
                    <img src={logo} alt="Logo"/>
                    <h1>Provider-Chain</h1>
                </div>
                <div style={{float:'right'}}>
                    <Spin size="large" spinning={this.props.running > 0}  />
                    <Dropdown overlay={menu} trigger={['click']}>
                        <span><Icon type="setting" style={{color:'white', fontSize:24}}/></span>
                    </Dropdown>
                </div>
            </LayoutHeader>
        );
    }
}

function mapStoreToProps(store, props) {
    return {
        running:store.user.requestsRunning
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStoreToProps, mapDispatchToProps)(Header);
