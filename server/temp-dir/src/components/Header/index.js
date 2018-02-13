import React, {Component} from 'react';

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from "../../redux/actions";

import { Layout, Select, Button, Spin, Row, Col } from 'antd';
const { Header:LayoutHeader } = Layout;
const { Option } = Select;


class Header extends Component {

    componentDidMount (){
        this.props.actions.getConfig();
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.selectedPeer !== this.props.selectedPeer){
            this.props.actions.getChannels(nextProps.selectedPeer);
        }

        if(nextProps.selectedChannel !== this.props.selectedChannel) {
            this.props.actions.getChaincodes(nextProps.selectedPeer, nextProps.selectedChannel);
        }

    }

    render() {
        return (
            <LayoutHeader>
                <Row>

                    <Col lg={6} xl={4}>
                        <label style={{color: "white", "marginRight": 5}}>Peer:</label>
                        <Select value={this.props.selectedPeer} style={{ width: 120, "marginRight": 20 }} onChange={this.props.actions.selectPeer}>
                            { this.props.peers.map( peer => <Option value={peer} key={peer}>{peer}</Option> ) }
                        </Select>
                    </Col>

                    <Col lg={6}  xl={4}>
                        <label style={{color: "white", "marginRight": 5}}>Channel:</label>
                        <Select value={this.props.selectedChannel}  style={{ width: 120, "marginRight": 20 }} onChange={this.props.actions.selectChannel}>
                            { this.props.channels.map( channel => <Option value={channel} key={channel}>{channel}</Option> ) }
                        </Select>
                    </Col>

                    <Col lg={6}  xl={4}>
                        <label style={{color: "white", "marginRight": 5}}>Chaincode:</label>
                        <Select value={this.props.selectedChaincode}  style={{ width: 120, "marginRight": 20 }} onChange={this.props.actions.selectChaincode}>
                            { this.props.chaincodes.map( chaincode => <Option value={chaincode} key={chaincode}>{chaincode}</Option> ) }
                        </Select>
                    </Col>

                    <Col lg={1}  xl={9}></Col>

                    <Col lg={4}  xl={2}>
                        <Button type="primary" className="login-form-button" onClick={this.props.actions.logout}>
                            Logout
                        </Button>
                    </Col>

                    <Col lg={1}  xl={1}>
                        <Spin size="large" spinning={this.props.running > 0}  />
                    </Col>


                </Row>

            </LayoutHeader>
        );
    }
}

function mapStoreToProps(store, props) {
    return {
        providers:store.providers,

        peers:store.providers.peers,
        selectedPeer:store.providers.selectedPeer,

        channels:store.providers.channels,
        selectedChannel:store.providers.selectedChannel,

        chaincodes:store.providers.chaincodes,
        selectedChaincode:store.providers.selectedChaincode,

        running:store.user.requestsRunning

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStoreToProps, mapDispatchToProps)(Header);
