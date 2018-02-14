import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from "../redux/actions";

import React, { Component } from 'react';

import { Form, Icon, Input, Button, Row, Col} from 'antd';

import './Login.css';

const FormItem = Form.Item;

class Login extends Component {

  constructor(props) {
      super(props);

      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            this.props.login(values);
        }

    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (<Row  xs={2} sm={4} md={6} lg={8} xl={10} className="outerDiv">
            <Col offset={8} span={8}>
                <div className="mainDiv">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" className="loginForm" />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock"  className="loginForm" />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button, loginButton">
                            Log in
                        </Button>
                    </FormItem>
                </Form>
                </div>
            </Col>


        </Row>
    );
  }
}

function mapStoreToProps(store, props) {
    return {  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

const WrappedNormalLoginForm = Form.create()(Login);

export default connect(mapStoreToProps, mapDispatchToProps)(WrappedNormalLoginForm);
