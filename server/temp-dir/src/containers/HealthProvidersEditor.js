import React, { Component } from 'react';
import DifferencesDisplay from '../components/DifferencesDisplay'

//REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from "../redux/actions";

//antD
import { Form, Row, Col, Input, Button, Timeline, Card, DatePicker} from 'antd';
import './HealthProvidersEditor.css';
const FormItem = Form.Item;


class HealthProvidersEditor extends Component {

    constructor(props) {
        super(props);

        if(this.props.selectedPeer && this.props.selectedChannel  && this.props.selectedChaincode && this.props.match.params.id){
            this.props.getProvider( this.props.match.params.id );
            this.props.getProviderHistory( this.props.match.params.id );
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if( !this.props.form.getFieldValue('credentialNumber')  && nextProps.provider !== null ){
            this.props.form.setFieldsValue(nextProps.provider);
        }

        if(nextProps.selectedPeer && nextProps.selectedChannel  && nextProps.selectedChaincode && nextProps.match.params.id && !this.props.form.getFieldValue('credentialNumber')){
            this.props.getProvider( nextProps.match.params.id );
            this.props.getProviderHistory( nextProps.match.params.id );
        }

        if( nextProps.selectedPeer && nextProps.selectedChannel  && nextProps.selectedChaincode &&
            (nextProps.selectedPeer !== this.props.selectedPeer ||
                nextProps.selectedChannel !== this.props.selectedChannel ||
                nextProps.selectedChaincode !== this.props.selectedChaincode )  ) {
            if(this.props.match.params.id){
                this.props.getProvider( nextProps.match.params.id );
                this.props.getProviderHistory( nextProps.match.params.id );
            }
        }
        if ( this.props.match.params.id && !nextProps.match.params.id ) {
            this.props.clearProvider();
            this.props.form.resetFields('');
        }

    }

    handleSubmit (event)  {
        event.preventDefault();
        let props = this.props;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let valuesClone = Object.assign({}, values);

                if(this.props.provider)
                    valuesClone.index = this.props.provider.index;

                ['lastIssueDate', 'firstIssueDate', 'expirationDate', 'ceDueDate'].forEach(function(property){
                    valuesClone[property] = (valuesClone[property] && valuesClone[property].isValid())
                        ? valuesClone[property].format('YYYYMMDD')
                        : null;
                });

                if(this.props.match.params.id){
                    this.props.updateProvider(valuesClone).then((results) => console.log(results));
                }else{
                    this.props.createProvider(valuesClone);
                }


                // if(props.match.params.id)
                //     setTimeout(function(){
                //         // props.getProvider( props.match.params.id );
                //         props.getProviderHistory( props.match.params.id );
                //     }, 3000)
            }
        });
    };


    render() {
        const isEditing = this.props.match.params.id;

        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row type="flex" justify="center" align="top" gutter={10}>
                    <Col md={24} lg={16}>
                        <Card title={"Health Provider " + (isEditing ? 'Edit' : 'Creation')}>
                            <Form layout="vertical" onSubmit={this.handleSubmit}>
                                <Row type="flex" justify="space-between" align="top" gutter={20}>
                                    {/*Credential Number*/}
                                    <Col md={24} >
                                        <FormItem label="Credential Number">
                                            {getFieldDecorator('credentialNumber', {
                                                rules: [ {
                                                    required: true, message: 'Credential Number is required as primary key ',
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*credentialType */}
                                    <Col md={24} lg={18}>
                                        <FormItem  label="Credential Type" >
                                            {getFieldDecorator('credentialType')(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*status */}
                                    <Col md={24} lg={6}>
                                        <FormItem  label="status" >
                                            {getFieldDecorator('status')(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*firstName */}
                                    <Col md={24} lg={7}>
                                        <FormItem  label="First Name">
                                            {getFieldDecorator('firstName', {
                                            })(
                                                <Input />

                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*middleName */}
                                    <Col md={24} lg={5}>
                                        <FormItem  label="Middle Name" >
                                            {getFieldDecorator('middleName')(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*lastName */}
                                    <Col md={24} lg={7}>
                                        <FormItem  label="Last Name" >
                                            {getFieldDecorator('lastName')(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*birthYear */}
                                    <Col md={12} lg={5}>
                                        <FormItem  label="birthYear" >
                                            {getFieldDecorator('birthYear')(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*ceDueDate */}
                                    <Col md={12} lg={4}>
                                        <FormItem  label="ceDueDate" >
                                            {getFieldDecorator('ceDueDate')(
                                                <DatePicker format={"YYYYMMDD"} />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*actionTaken */}
                                    <Col md={12} lg={4}>
                                        <FormItem  label="actionTaken" >
                                            {getFieldDecorator('actionTaken')(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*expirationDate */}
                                    <Col md={12} lg={4}>
                                        <FormItem  label="expirationDate" >
                                            {getFieldDecorator('expirationDate')(
                                                <DatePicker format={"YYYYMMDD"} />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*firstIssueDate */}
                                    <Col md={12} lg={4}>
                                        <FormItem  label="firstIssueDate" >
                                            {getFieldDecorator('firstIssueDate')(
                                                <DatePicker format={"YYYYMMDD"} />
                                            )}
                                        </FormItem>
                                    </Col>

                                    {/*lastIssueDate */}
                                    <Col md={12} lg={4}>
                                        <FormItem key='lastIssueDate'
                                                  label="Last Issue Date">
                                            {getFieldDecorator('lastIssueDate')(
                                                <DatePicker format={"YYYYMMDD"} />
                                            ) }
                                        </FormItem>
                                    </Col>

                                </Row>

                                {this.props.isAdmin || true ? (
                                    <FormItem>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            {isEditing ? 'Update' : 'Create'}
                                        </Button>
                                    </FormItem>
                                ) : (<div/>)}

                            </Form>
                        </Card>
                    </Col>

                    <Col md={24} lg={8} >
                        <Card title="History">
                            <Timeline className="time-line">
                                {
                                    (this.props.history || []).map( (transaction) => {
                                        return (

                                            <Timeline.Item key={transaction.TxId}>
                                                <div class="txDate"><strong>Date: </strong>{transaction.Timestamp.format('lll')}</div>
                                                <div class="txDate"><strong>Tx: </strong>{transaction.TxId}</div>
                                                <div class="changes"><strong>Changes {transaction.username ? "made by" : null}:</strong> {transaction.username}
                                                    <div className="differences">
                                                        <DifferencesDisplay
                                                            differences={transaction.differences}
                                                            transaction={transaction}>
                                                        </DifferencesDisplay>
                                                    </div>
                                                </div>
                                            </Timeline.Item>

                                        );
                                    })

                                }
                            </Timeline>
                        </Card>
                    </Col>

                </Row>

            </div>
        );
    }
}

function mapStoreToProps(store, props) {
    return {
        provider:store.providers.provider,
        history:store.providers.providerHistory,

        selectedPeer:store.providers.selectedPeer,
        selectedChannel:store.providers.selectedChannel,
        selectedChaincode:store.providers.selectedChaincode,

        isAdmin:store.user.isAdmin
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

const WrappedHealthProvidersEditor = Form.create()(HealthProvidersEditor);

export default connect(mapStoreToProps, mapDispatchToProps)(WrappedHealthProvidersEditor);
