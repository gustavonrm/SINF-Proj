import React, { Component } from "react";
import api from "../api";
import { Content, NavBar, SideNav } from "../components";
import "../style/App.css";

class Inventory extends Component {
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
            <SideNav page={"Inventory"} />
            <Content />
          </div>
        </div>
      </>
    );
  }
}

export default Inventory;
