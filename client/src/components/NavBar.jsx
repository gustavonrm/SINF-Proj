import React, { Component } from "react";

class NavBar extends Component {
  state = {};
  render() {
    return (
      <>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrapshadow">
          <div style={{ color: "white", zIndex: "-1" }}>360º DashBoard</div>
          <ul class="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <a className="nav-link" href="#">
                Sign out
              </a>
            </li>
          </ul>
        </nav>
      </>
    );
  }
}

export default NavBar;
