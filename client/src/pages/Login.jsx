import React, { Component } from "react";
import api from "../api";
import { Logo, Home } from "../components";
import "../style/Login.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <>
        <Logo />
        <Home />
        <form class="form-signin">
          <div class="text-center mb-4"></div>

          <div class="form-label-group">
            <input
              type="email"
              id="inputEmail"
              class="form-control"
              placeholder="Email address"
              required=""
              autofocus=""
            />
          </div>

          <div class="form-label-group">
            <input
              type="password"
              id="inputPassword"
              class="form-control"
              placeholder="Password"
              required=""
            />
          </div>

          <button class="btn btn-lg btn-primary btn-block" type="submit">
            Sign in
          </button>
        </form>
      </>
    );
  }
}

export default Login;
