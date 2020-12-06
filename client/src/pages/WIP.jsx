import React, { Component } from "react";
import api from "../api";
import { ContentWIP, NavBar, SideNav } from "../components";
import "../style/App.css";

class WIP extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <>
        <NavBar />
        <div className="container-fluid h-100">
          <div className="row h-100">
            <SideNav page={"Accounts"} />
            <ContentWIP />
          </div>
        </div>
      </>
    );
  }
}

export default WIP;
