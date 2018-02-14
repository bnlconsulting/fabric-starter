import React, {Component} from 'react';

import {Popover} from 'antd';


import './index.css';

class DifferenceDisplay extends Component {
    render() {
        return (<div>
                {
                    this.props.differences
                        .slice(0, this.props.limit)
                        .map((propSet, index) =>{
                            return (
                                <div key={this.props.transaction.TxId + index}>
                                    <div> <strong>{propSet.property}</strong> </div>
                                    <div> {propSet.old ? (<i>{propSet.old + " :"}</i> ) : ""  }  { propSet.new} </div>
                                </div>

                            );
                        })
                }

                {
                    this.props.differences.length > this.props.limit ? (
                        <Popover content={(<div>
                            {this.props.differences.map((propSet, index) =>{
                                return (
                                    <div key={this.props.transaction.TxId + index}>
                                        <div> <strong>{propSet.property}</strong> </div>
                                        <div> {propSet.old ? (<i>{propSet.old + " :"}</i> ) : ""  }  { propSet.new} </div>
                                    </div>                        );
                            })
                            }
                        </div>)} >
                            <strong> more. . .</strong>
                        </Popover>) : null

                }
            </div>
        );
    }
}


export default DifferenceDisplay;
