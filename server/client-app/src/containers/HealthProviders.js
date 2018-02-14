import React, { Component } from 'react';
import './HealthProviders.css';
import DifferencesDisplay from '../components/DifferencesDisplay'

import { Link } from 'react-router-dom'

import _ from 'lodash';

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from "../redux/actions";

//antD
import { Table, Input, Card, Steps, Icon, Popover} from 'antd';
const Search = Input.Search;
const Step = Steps.Step;



const columns = [
    {
        title: 'Credential Number',
        dataIndex: 'Key',
        key: 'credentialNumber'
    },{
        title: 'First Name',
        dataIndex: 'Record.firstName',
        key: 'firstName'
    },{
        title: 'Last Name',
        dataIndex: 'Record.lastName',
        key: 'lastName'
    },{
        title: 'Middle Name',
        dataIndex: 'Record.middleName',
        key: 'middleName'
    },{
        title: 'Type',
        dataIndex: 'Record.credentialType',
        key: 'credentialType',
        width: 300,
    },{
        title: 'Status',
        dataIndex: 'Record.status',
        key: 'status'
    },{
        title: 'Expiration',
        dataIndex: 'Record.expirationDate',
        key: 'expirationDate'
    },{
        title: 'Action',
        key: 'edit',
        render:(text, record) =>{
            return ( <span>
                <Link  to={"/healthProviders/edit/" + record.Key}>Edit/Detail</Link>
        </span> )
        }

    }
];

class HealthProviders extends Component {

    constructor(props) {
        super(props);

        this.updateSearch = this.updateSearch.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if( nextProps.selectedOrg && nextProps.selectedPeer && nextProps.selectedChannel  && nextProps.selectedChaincode &&
            (nextProps.selectedOrg !== this.props.selectedOrg ||
                nextProps.selectedPeer !== this.props.selectedPeer ||
                nextProps.selectedChannel !== this.props.selectedChannel ||
                nextProps.selectedChaincode !== this.props.selectedChaincode )  ) {
            this.props.getProviderData();
        }

    }

    updateSearch(value){
        let search = {};
        if (value === ''){
            search = {   "selector":{docType:"provider", index:{$lt:1000}}    };
        }else{
            search = {   "selector":{docType:"provider", $or:[{firstName: value}, {lastName: value}, {credentialNumber:value}]}    };
        }
        this.props.getProviderData( search);
    }


    onExpand = (expanded, record) => {
        if(expanded && record.history == null)
            this.props.getProviderHistory(record.Key);
    };


    render() {
        return (
            <Card title="Data Providers List">

                <Search className="search"
                        placeholder="input search text"
                        onSearch={this.updateSearch}
                        enterButton />
                <br/>

                <Table columns={columns}
                       dataSource={this.props.list}
                       rowKey="Key"
                       loading={this.props.running > 0}
                       onExpand={this.onExpand}
                       expandedRowRender={record => (<div>

                           {/*AP60025716*/}
                           <Steps size="small"  >
                               {
                                   (record.history || [])
                                       .slice(0, 4)
                                       .map((transaction, index, collection) => {

                                       console.log(transaction);
                                       return (
                                           <Step key={transaction.TxId}
                                               icon={transaction.txOrder === 0
                                                   ?   (<Icon type="check-circle-o" />)
                                                   : index === 0
                                                       ?    (<div className="custom-icon-provider current" >
                                                           <span>{transaction.txOrder + 1}</span>
                                                       </div>)
                                                       :    (<div className="custom-icon-provider past" >
                                                           <span>{transaction.txOrder + 1}</span>
                                                       </div>)
                                               }

                                               title={transaction.txOrder === 0 ? "Created" : "Update"}
                                               description={
                                               <div>
                                                   <div >{transaction.username}  </div>
                                                   <div >{transaction.Timestamp.format('l LT')}</div>
                                                   <DifferencesDisplay
                                                       differences={transaction.differences}
                                                       transaction={transaction}
                                                       limit={4}>
                                                   </DifferencesDisplay>                                               </div>
                                               } />
                                       )
                                   })
                               }

                           </Steps>


                       </div>)}
                />

            </Card>
        );
    }
}

function mapStoreToProps(store, props) {
    return {
        list:store.providers.list,

        selectedOrg:store.providers.selectedOrg,
        selectedPeer:store.providers.selectedPeer,
        selectedChannel:store.providers.selectedChannel,
        selectedChaincode:store.providers.selectedChaincode,

        running:store.user.requestsRunning
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(HealthProviders);
