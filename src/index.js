import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './styles.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Button } from 'antd';
import TiffinCalc from './TiffinCalc';
import RoomCalc from './RoomCalc';

const Routing = () => {
    return (
        <div>
            <br />
            <h2 className='m'>What would you like to calculate</h2>
            <Link to='/tiffin'>
                <Button className='m' type='primary'>
                    Tiffin Calculator
                </Button>
            </Link>
            <Link to='/room'>
                <Button className='m' type='primary'>
                    Room Calculator
                </Button>
            </Link>
        </div>
    );
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Router>
                <Route exact path='/' component={Routing} />
                <Route exact path='/tiffin' component={TiffinCalc} />
                <Route exact path='/room' component={RoomCalc} />
            </Router>
        );
    }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
