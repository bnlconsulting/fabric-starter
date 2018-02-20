import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Menu, Select, Icon} from 'antd';

import { Link } from 'react-router-dom'

import * as actions from '../../redux/actions';
import './index.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Option } = Select;


class SideMenu extends Component {
    render() {
        const onClick = function ({keyPath:[value, selection]}) {
            switch(selection) {
                case 'peerSelection':
                    this.props.actions.selectPeer(value);
                    break;
                case 'channelSelection':
                    this.props.actions.selectChannel(value);
                    break;
                case 'chaincodeSelection':
                    this.props.actions.selectChaincode(value);
                    break;
                default:
                    break;
            }
        };

        return (
            <Menu style={{height: '100%'}}
                  onClick={onClick.bind(this)}
                  className="SideMenu"
                  mode="vertical"  >

                <MenuItemGroup key="g1" title="Navigation">
                    <Menu.Item key="Providers"><Link to="/healthProviders"><Icon type="table"/>Providers</Link></Menu.Item>
                    <Menu.Item key="Create"><Link to="/healthProviders/create"><Icon type="edit"/>Create</Link></Menu.Item>
                    <Menu.Item key="History"><Link to="/healthProviders/history"><Icon type="schedule" />Transaction History</Link></Menu.Item>
                </MenuItemGroup>

                <Menu.Divider/>

                <MenuItemGroup key="g2" title="Options">
                    <SubMenu key="peerSelection" title={<span><Icon type="share-alt"/><span>Peer Selection</span> <br/> {this.props.selectedPeer}</span>}>
                        { this.props.peers.map( peer => <Menu.Item key={peer}
                                                                   style={{backgroundColor:this.props.selectedPeer===peer?'#42b5aa':'inherit'}}>{peer}
                        </Menu.Item> ) }
                    </SubMenu>

                    <SubMenu key="channelSelection" title={<span><Icon type="notification" /><span>Channel Selection</span> <br/> {this.props.selectedChannel}</span>}>
                        { this.props.channels.map( channel => <Menu.Item key={channel}
                                                                         style={{backgroundColor:this.props.selectedChannel===channel?'#42b5aa':'inherit'}} >{channel}</Menu.Item> ) }
                    </SubMenu>

                    <SubMenu key="chaincodeSelection" title={<span><Icon type="link"/><span>Chaincode Selection</span> <br/> {this.props.selectedChaincode}</span>}>
                        { this.props.chaincodes.map( chaincode => <Menu.Item key={chaincode}
                                                                             style={{backgroundColor:this.props.selectedChaincode===chaincode?'#42b5aa':'inherit'}} >{chaincode}</Menu.Item> ) }
                    </SubMenu>
                </MenuItemGroup >
            </Menu>
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

export default connect(mapStoreToProps, mapDispatchToProps)(SideMenu);