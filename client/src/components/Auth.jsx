import React, { Component } from "react";
import "whatwg-fetch";

import { getFromStorage, setInStorage } from "../app/utils/storage";

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "",
      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpEmail: "",
      signUpPassword: "",
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(
      this
    );
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(
      this
    );
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(
      this
    );
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(
      this
    );

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch("http://localhost:3000/api/auth/verify?token=" + token)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onSignUp() {
    // Grab state
    const { signUpEmail, signUpPassword } = this.state;
    this.setState({
      isLoading: true,
    });
    // Post request to backend
    fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: "",
            signUpPassword: "",
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
  }

  onSignIn() {
    // Grab state
    const { signInEmail, signInPassword } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setInStorage("the_main_app", { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: "",
            signInEmail: "",
            token: json.token,
          });
          window.location.href = "/";
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch("http://localhost:3000/api/auth/logout?token=" + token)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            this.setState({
              token: "",
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpError,
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!token) {
      return (
        <>
          <div>
            <div className="form-signin">
              {signInError ? <p>{signInError}</p> : null}
              <div className="text-center mb-4"></div>
              <p>Username</p>
              <div className="form-label-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="User"
                  value={signInEmail}
                  onChange={this.onTextboxChangeSignInEmail}
                  required=""
                  autofocus=""
                />
              </div>
              <p>Password</p>
              <div className="form-label-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  required=""
                  value={signInPassword}
                  onChange={this.onTextboxChangeSignInPassword}
                />
              </div>

              <button
                onClick={this.onSignIn}
                className="btn btn-lg btn-primary btn-block login-btn"
              >
                Sign in
              </button>
            </div>
          </div>
          {/*
          <div>
            {signUpError ? <p>{signUpError}</p> : null}
            <p>Username</p>
            <input
              type="email"
              placeholder="Username"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            />
            <br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
          */}
        </>
      );
    }

    return (
      <div>
        <p>Signed in...</p>
      </div>
    );
  }
}

export default Auth;
