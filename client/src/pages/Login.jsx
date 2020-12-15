import React, { Component } from "react";
import { Logo, Auth } from "../components";
import "../style/Login.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <>
        <div id="login-page">
          <div className="container ">
            <div className="row d-flex justify-content-center">
              <Logo />
            </div>
          </div>
          <Auth />
        </div>
      </>
    );
  }
}

export default Login;
