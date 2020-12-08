import React, { Component } from 'react';
import api from '../api';

import '../style/App.css';

import { Content, NavBar, SideNav } from '../components';

class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <>
        <NavBar />
        <div className='container-fluid'>
          <div className='row'>
            <SideNav page={'Overview'} />
            <Content />
          </div>
        </div>
      </>
    );
  }
}

export default Overview;
