//REACT
import React, { Component } from 'react';

//antD
import {Popover} from 'antd';


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
                                    <div> {propSet.old ? (<i>{propSet.old + " :"}</i> ) : ""  }  { propSet.new} &nbsp;</div>
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
                                        <div> {propSet.old ? (<i>{propSet.old + " :"}</i> ) : ""  }  { propSet.new} &nbsp;</div>
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
