import React, { Component } from 'react';
import './HealthProviders.css';
import DifferencesDisplay from '../components/DifferencesDisplay'

import { Link } from 'react-router-dom'

import _ from 'lodash';

import { reqwest } from 'reqwest';

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
        key: 'credentialNumber',
        sorter: true,
        render: credentialNumber => `${credentialNumber}`,
        defaultSortOrder: 'ascend',
        //sorter: (a, b) => { return a.Record.credentialNumber.localeCompare(b.Record.credentialNumber)},
    },{
        title: 'First Name',
        dataIndex: 'Record.firstName',
        key: 'firstName',
        defaultSortOrder: 'ascend',
        sorter: true,
        render: firstName => `${firstName}`,
        //sorter: (a, b) => { return a.Record.firstName.localeCompare( b.Record.firstName)},
        
    },{
        title: 'Last Name',
        dataIndex: 'Record.lastName',
        key: 'lastName',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => { return a.Record.lastName.localeCompare( b.Record.lastName)}
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

    state = {
        data: [],
        pagination: {},
        loading: false,
      };
      handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
        });
        this.fetch({
          results: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        });
      }
      fetch = (params = {}) => {
        console.log('params:', params);
        this.setState({ loading: true });
        reqwest({
          url: 'https://randomuser.me/api',
          method: 'get',
          data: {
            results: 10,
            ...params,
          },
          type: 'json',
        }).then((data) => {
          const pagination = { ...this.state.pagination };
          // Read total count from server
          // pagination.total = data.totalCount;
          pagination.total = 200;
          this.setState({
            loading: false,
            data: data.results,
            pagination,
          });
        });
      }
      componentDidMount() {
        this.fetch();
      }

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
                       pagination={{ showSizeChanger:true, pageSizeOptions: ['10', '25', '50', '100'] }}
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
