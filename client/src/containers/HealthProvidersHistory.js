//REACT
import React, { Component } from 'react';

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from "../redux/actions";

//antD
import { Table, Card } from 'antd';

//INTERNAL
import './HealthProvidersHistory.css';

//REACT ROUTER
import { Link } from 'react-router-dom'

const columns = [
    {
        title: 'Block Number',
        dataIndex: 'blockNumber',
        key: 'blockNumber'
    },{
        title: 'Transaction',
        dataIndex: 'txId',
        key: 'txId',
    },{
        title: 'Date',
        dataIndex: 'timestamp',
        key: 'timestamp',
    },{
        title: 'User',
        dataIndex: 'username',
        key: 'username'
    },{
        title: 'Credential',
        dataIndex: 'write.credentialNumber',
        key: 'credentialNumber',
        render:(text, record) =>{
            return ( <span>
                <Link  to={"/healthProviders/edit/" + (record.write ? record.write.credentialNumber : '')}>{record.write ? record.write.credentialNumber : 'null'}</Link>
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
                       rowKey={(record) => {return record.blockNumber + record.write.credentialNumber}}
                       expandedRowRender={record => {
                           let display = [];
                           for(let property in record.write ? record.write : []){
                               display.push(<p className="historyWrite" key={property}><strong>{property}:</strong> {record.write[property]}</p>)
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
