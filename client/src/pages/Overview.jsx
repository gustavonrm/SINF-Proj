import React, { Component } from "react";
import api from "../api";

import { NavBar, SideNav } from "../components";

class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <>
        <NavBar />
        <SideNav />
      </>
    );
  }
}

export default Overview;
