import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { DatePicker, Input, Button, Table, List, Checkbox, Radio, Row, Col } from 'antd';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
let i = 1;

export default class TiffinCalc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomdata: [],
            summary: {}
        };
        this.people = [
            { label: 'Shehzad', value: 'Shehzad' },
            { label: 'Fahad', value: 'Fahad' },
            { label: 'Gulzar', value: 'Gulzar' },
            { label: 'Naseem', value: 'Naseem' },
            { label: 'Faisal', value: 'Faisal' },
            { label: 'Faizan', value: 'Faizan' },
            { label: 'SRK', value: 'SRK' }
        ];
        this.columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: 'Spender',
                dataIndex: 'spender',
                key: 'spender'
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price'
            },
            {
                title: 'Invoved',
                dataIndex: 'involved',
                key: 'involved'
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href='javascript:;' onClick={() => this.deleteRecord(record)}>
                            Delete
                        </a>
                    </span>
                )
            }
        ];
    }

    deleteRecord(record) {
        let newAry = [];
        this.setState(state => {
            state.roomdata.forEach(d => {
                if (d.key != record.key) {
                    newAry.push(d);
                }
            });
            return { roomdata: newAry };
        });
    }

    handleInput(val) {
        this.setState({
            price: val.target.value
        });
    }

    handleDate(date, dateString) {
        this.setState({
            date: dateString
        });
    }
    handleSpender(val) {
        this.setState({
            spender: val.target.value
        });
    }
    handleSelect(val) {
        this.setState({
            involved: val
        });
    }

    handleSubmit(e) {
        let d = {
            key: i,
            date: this.state.date,
            spender: this.state.spender,
            price: this.state.price,
            involved: this.state.involved ? this.state.involved.join(',') : '-'
        };
        this.setState({
            roomdata: [...this.state.roomdata, d]
        });
        i++;
    }

    makePersonNestedObject() {
        let perPersonSpendObj = {};
        this.people.forEach(person => {
            let obj = {};
            this.people.forEach(person_inside => {
                obj[person_inside.value] = 0;
            });
            perPersonSpendObj[person.value] = obj;
        });
        return perPersonSpendObj;
    }

    calculateAmt() {
        let perPersonSpendObj = this.makePersonNestedObject();
        // let finalSpendObj = this.makePersonNestedObject();

        let roomdata = this.state.roomdata;
        roomdata.forEach(record => {
            let involvedPersonArray = record.involved.split(',');
            let spenderName = record.spender;
            let individualPrice = record.price / involvedPersonArray.length;
            for (let i = 0; i < involvedPersonArray.length; i++) {
                perPersonSpendObj[spenderName][involvedPersonArray[i]] += individualPrice;
            }
        });
        console.log(perPersonSpendObj);

        let perPersonSpendObjKeys = Object.keys(perPersonSpendObj);
        for (let i = 0; i < perPersonSpendObjKeys.length; i++) {
            let individualSpenderObj = perPersonSpendObj[perPersonSpendObjKeys[i]];
            let individualSpenderName = perPersonSpendObjKeys[i];

            for (let targetName in individualSpenderObj) {
                let sourceSpenderTarget = individualSpenderObj[targetName];

                let targetObj = perPersonSpendObj[targetName];
                if (targetObj[individualSpenderName] > individualSpenderObj[individualSpenderName]) {
                    let diff = targetObj[individualSpenderName] - individualSpenderObj[individualSpenderName];
                    console.log(diff);
                }
            }
        }
    }

    render() {
        return (
            <Row style={{ marginLeft: 20 }}>
                <Col span={16}>
                    <br />
                    <Link to='/'>
                        <Button style={{ marginBottom: 10 }} icon='arrow-left' type='primary'>
                            Back
                        </Button>
                    </Link>
                    <h2>Room Calculation</h2>
                    <DatePicker onChange={this.handleDate.bind(this)} />
                    <Input
                        style={{ width: 250, marginLeft: 10 }}
                        placeholder='Enter price'
                        onChange={this.handleInput.bind(this)}
                    />
                    <div>
                        <br />
                        <div style={{ marginBottom: 10 }}>
                            <b>Spender:</b>
                            <br />
                            <RadioGroup options={this.people} onChange={this.handleSpender.bind(this)} />
                        </div>
                        <br />
                        <div style={{ marginBottom: 10 }}>
                            <b>Involved:</b>
                            <br />
                            <CheckboxGroup options={this.people} onChange={this.handleSelect.bind(this)} />
                        </div>
                        <Button onClick={this.handleSubmit.bind(this)} type='primary' style={{ marginTop: 10 }}>
                            Submit
                        </Button>
                    </div>
                    <div>
                        <br />
                        <Table bordered pagination={false} dataSource={this.state.roomdata} columns={this.columns} />
                    </div>
                    <br />
                    <Button
                        onClick={this.calculateAmt.bind(this)}
                        disabled={!this.state.roomdata.length}
                        type='primary'>
                        Calculate
                    </Button>
                </Col>
                <Col span={8}>
                    {Object.keys(this.state.summary).length ? (
                        <div>
                            <br />
                            <br />
                            <br />
                            <List
                                size='small'
                                header={
                                    <div>
                                        <b>Summary:</b>
                                    </div>
                                }
                                bordered>
                                List comes here
                            </List>
                            <br />
                        </div>
                    ) : null}
                </Col>
            </Row>
        );
    }
}
