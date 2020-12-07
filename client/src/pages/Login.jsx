import React, { Component } from "react";
import { Logo, Auth } from "../components";
import "../style/Login.css";

import { getFromStorage } from "../app/utils/storage";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    console.log("Storage" + getFromStorage("the_main_app"));
    return (
      <>
        <Logo />
        <Auth />
      </>
    );
  }
}

export default Login;
