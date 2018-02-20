/**
 * Created by jason.phelps on 1/10/2018.
 */
import React, { Component } from 'react';

import { Link } from 'react-router-dom'

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from "../redux/actions";

//styles
import './HealthProvidersHistory.css';

//antD
import { Table, Input, Card } from 'antd';
const Search = Input.Search;

const columns = [
    {
        title: 'Block Number',
        dataIndex: 'blockNumber',
        key: 'blockNumber'
    },{
        title: 'Transaction',
        dataIndex: 'txId',
        key: 'txId',
        // width: 300,
    },{
        title: 'Date',
        dataIndex: 'timestamp',
        key: 'timestamp',
        // render:(text, record) =>{
        //     return ( <span>
        //         <Link  to={"/healthProviders/edit/" + record.Key}>Edit</Link>
        // </span> )
        // }
    },{
        title: 'User',
        dataIndex: 'username',
        key: 'username'
    },{
        title: 'Credential',
        dataIndex: 'write.key',
        key: 'key',
        render:(text, record) =>{
            return ( <span>
                <Link  to={"/healthProviders/edit/" + (record.write ? record.write.key : '')}>{record.write ? record.write.key : 'null'}</Link>
        </span> )
        }
    }
];

class HealthProvidersHistory extends Component {

    constructor(props) {
        super(props);

        if( this.props.selectedOrg && this.props.selectedPeer && this.props.selectedChannel  && this.props.selectedChaincode  ) {
            this.props.getTxHistory();
        }
    }

    componentWillReceiveProps(nextProps){
        if( nextProps.selectedOrg && nextProps.selectedPeer && nextProps.selectedChannel  && nextProps.selectedChaincode &&
            (nextProps.selectedOrg !== this.props.selectedOrg ||
                nextProps.selectedPeer !== this.props.selectedPeer ||
                nextProps.selectedChannel !== this.props.selectedChannel ||
                nextProps.selectedChaincode !== this.props.selectedChaincode )  ) {
            this.props.getTxHistory();
        }

    }

    render() {
        return (
            <Card title="Transaction History">
                <Table columns={columns}
                       pagination={{ showSizeChanger:true, pageSizeOptions: ['10', '25', '50', '100'] }}
                       dataSource={this.props.txHistory}
                       rowKey="blockNumber"
                       expandedRowRender={record => {
                           let display = [];
                           for(let property in record.write ? record.write.value : []){
                               display.push(<p className="historyWrite" key={property}><strong>{property}:</strong> {record.write.value[property]}</p>)
                           }
                           return (<div>
                                   {display}
                           </div>)
                       }
                       }
                />

            </Card>
        );
    }
}


function mapStoreToProps(store, props) {
    return {

        selectedOrg:store.providers.selectedOrg,
        selectedPeer:store.providers.selectedPeer,
        selectedChannel:store.providers.selectedChannel,
        selectedChaincode:store.providers.selectedChaincode,
        txHistory:store.providers.txHistory


    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(HealthProvidersHistory);
