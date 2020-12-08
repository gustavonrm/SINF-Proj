import React, { Component } from 'react';
import api from '../api';
import { Content, NavBar, SideNav } from '../components';
import '../style/App.css';

class Purchase extends Component {
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
            <SideNav page={'Purchases'} />
            <Content />
          </div>
        </div>
      </>
    );
  }
}

export default Purchase;
