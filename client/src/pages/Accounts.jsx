import React, { Component } from "react";
import api from "../api";
import { Content, NavBar, SideNav } from "../components";
import "../style/App.css";

class Accounts extends Component {
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
            <SideNav page={"Accounts"} />
            <Content />
          </div>
        </div>
      </>
    );
  }
}

export default Accounts;
