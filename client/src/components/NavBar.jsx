import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import "../style/NavBar.css";

class NavBar extends Component {
  state = {};
  render() {
    return (
      <>
        <nav className="navbar fixed-top flex-md-nowrapshadow">
          <div>360º DashBoard</div>
          <ul class="navbar-nav px-3">
            <li className="nav-item text-nowrap">
              <a className="nav-link" href="#">
                Logout
                <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
              </a>
            </li>
          </ul>
        </nav>
      </>
    );
  }
}

export default NavBar;
