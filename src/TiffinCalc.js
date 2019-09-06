import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { DatePicker, Input, Select, Button, Table, List, Checkbox, Row, Col } from 'antd';
let i = 1;

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

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
                title: 'Tiffin',
                dataIndex: 'numTiffin',
                key: 'numTiffin'
            },
            {
                title: 'Not Invoved',
                dataIndex: 'notInvolved',
                key: 'notInvolved'
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
            numTiffin: val
        });
    }
    handleDate(date, dateString) {
        this.setState({
            date: dateString
        });
    }
    handleSelect(val) {
        this.setState({
            notInvolved: val
        });
    }
    handleSubmit(e) {
        let d = {
            key: i,
            date: this.state.date,
            numTiffin: this.state.numTiffin,
            notInvolved: this.state.notInvolved ? this.state.notInvolved.join(',') : '-'
        };
        this.setState({
            roomdata: [...this.state.roomdata, d]
        });
        i++;
    }
    calculateAmt() {
        Array.prototype.diff = function(a) {
            return this.filter(function(i) {
                return a.indexOf(i) < 0;
            });
        };
        const TIFFIN_PRICE = 60;
        const PEOPLE = ['Shehzad', 'Fahad', 'Naseem', 'Gulzar', 'Faisal', 'Faizan', 'SRK'];
        let priceGiven = {
            Shehzad: 0,
            Fahad: 0,
            Naseem: 0,
            Gulzar: 0,
            Faisal: 0,
            Faizan: 0,
            SRK: 0
        };
        let data = this.state.roomdata;
        let totalPrice = 0;
        data.forEach(d => {
            let personsArray = d.notInvolved.split(',');
            let invlovedPeople = PEOPLE.diff(personsArray);
            let rowPrice = d.numTiffin * TIFFIN_PRICE;
            let individualPrice = rowPrice / invlovedPeople.length;
            for (let i = 0; i < invlovedPeople.length; i++) {
                priceGiven[invlovedPeople[i]] += individualPrice;
            }

            totalPrice += d.numTiffin * TIFFIN_PRICE;
        });
        this.setState({
            summary: priceGiven,
            totalPrice: totalPrice
        });
    }
    render() {
        var rows = [];
        for (var k in this.state.summary) {
            rows.push(
                <List.Item key={k}>
                    {k} will give: {this.state.summary[k]} rupees
                </List.Item>
            );
        }
        return (
            <Row style={{ marginLeft: 20 }}>
                <Col span={16}>
                    <br />
                    <Link to='/'>
                        <Button style={{ marginBottom: 10 }} icon='arrow-left' type='primary'>
                            Back
                        </Button>
                    </Link>
                    <h2>Tiffin Calculation</h2>
                    <DatePicker onChange={this.handleDate.bind(this)} />
                    <Select
                        placeholder='Enter number of tiffin'
                        onChange={this.handleInput.bind(this)}
                        style={{ width: 200, marginLeft: 10 }}>
                        <Option value='1'>1</Option>
                        <Option value='2'>2</Option>
                        <Option value='3'>3</Option>
                        <Option value='4'>4</Option>
                        <Option value='5'>5</Option>
                    </Select>
                    <div>
                        <br />
                        <div style={{ marginBottom: 10 }}>
                            <b>Not Involved:</b>
                        </div>
                        <CheckboxGroup options={this.people} onChange={this.handleSelect.bind(this)} />
                        <br />
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
                                        <b>Total Money: {this.state.totalPrice} rupees</b>
                                    </div>
                                }
                                bordered>
                                {rows}
                            </List>
                            <br />
                        </div>
                    ) : null}
                </Col>
            </Row>
        );
    }
}
