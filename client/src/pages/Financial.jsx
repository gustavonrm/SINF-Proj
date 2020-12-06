import React, { Component } from "react";
import api from "../api";
import { Content, NavBar, SideNav } from "../components";
import "../style/App.css";

class Financial extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <SideNav page={"Financial"} />
            <Content />
          </div>
        </div>
      </>
    );
  }
}

export default Financial;
