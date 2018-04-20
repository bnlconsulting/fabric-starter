//REACT
import React, { Component } from 'react';

//INTERNAL
import './HealthProviders.css';
import DifferencesDisplay from '../components/DifferencesDisplay'

//LODASH
import _ from 'lodash';

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from "../redux/actions";

//antD
import { Table, Input, Card, Steps, Icon } from 'antd';

//REACT ROUTER
import { Link } from 'react-router-dom'

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
        key: 'middleName',
    },{
        title: 'Type',
        dataIndex: 'Record.credentialType',
        key: 'credentialType',
        width: 300
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
        pagination: {pageSize:10, current:1},
        sort: {},
        sortField: null,
        search: {
            "selector": { }
        },
        searchField:''
    };
    constructor(props) {
        super(props);

        this.updateSearch = this.updateSearch.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if( nextProps.selectedOrg && nextProps.selectedPeer && nextProps.selectedChannel  && nextProps.selectedChaincode &&
            (nextProps.selectedOrg !== this.props.selectedOrg ||
                nextProps.selectedPeer !== this.props.selectedPeer ||
                nextProps.selectedChannel !== this.props.selectedChannel ||
                nextProps.selectedChaincode !== this.props.selectedChaincode )  ) {
            this.updateProvidersList();
        }

    }

    updateSearch(value){
        let selector = {   "selector":{ }  };

        if (value !== ''){
            selector = { "selector": {  $or: [{ firstName: value }, { middleName: value }, { lastName: value }, { credentialNumber: value }, { expirationDate: value }, { status: value }, { credentialType:value } ]}  };
        }

        this.setState({search:selector, searchField:value}, this.updateProvidersList);
    }

    updateProvidersList(){
        let base = {selector:{}};

        if (this.state.searchField === '') {
            base.selector.index = {"$gt":((this.state.pagination.current - 1) * this.state.pagination.pageSize), "$lte":(this.state.pagination.current )* this.state.pagination.pageSize};
        }

        this.props.getProviderData( _.merge(base, this.state.search, this.state.sort));

    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };

        pager.current = pagination.current;
        this.setState({
            pagination: pager
        }, this.updateProvidersList);
    };

    onExpand = (expanded, record) => {
        if(expanded && record.history == null)
            this.props.getProviderHistory(record.Key);
    };

    render() {
        const pagination = {
            ...this.paginationOptions,
            current: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
        };

        pagination.total = this.state.searchField === '' ? this.props.totalRecords : this.props.list.length;

        let historyLimit = 3;

        return (
            <Card title="Data Providers List">
                <Search className="search"
                        placeholder="input search text"
                        onSearch={this.updateSearch}
                        enterButton />
                <br/>

                <Table columns={columns}
                       pagination={pagination}
                       dataSource={this.props.list}
                       rowKey="Key"
                       loading={this.props.running > 0}
                       onChange={this.handleTableChange}
                       onExpand={this.onExpand}
                       expandedRowRender={record => (<div style={{marginRight:((record.history || []).length <= 3) ? 50  : 'inherit'}}>

                           <Steps size="small"  >
                               {
                                   (record.history || [])
                                       .slice(0, historyLimit)
                                       .map((transaction, index) => {
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
                                                             </DifferencesDisplay>
                                                         </div>
                                                     } />
                                           )
                                       })


                               }

                               {(record.history || []).length <= historyLimit ? '' :(
                                   <Step key="more"
                                         icon={ (<div className="custom-icon-provider past" >
                                                 <Icon type="ellipsis" style={{verticalAlign: "text-top", marginTop: 1}} />
                                             </div>

                                         )  }
                                         description={<Link  to={"/healthProviders/edit/" + record.Key} >
                                             <div>View <br/>Full <br/>History</div>
                                         </Link>}
                                   />
                               ) }


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
        totalRecords:store.providers.totalRecords,

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
