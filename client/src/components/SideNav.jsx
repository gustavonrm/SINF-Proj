import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

import Logo from "./Logo";

import "../style/SideBar.css";

class SideNav extends Component {
  state = {};
  render() {
    return (
      <nav
        className="col-md-2 d-none d-md-block bg-light sidebar fixed-left"
        style={{ zIndex: "1" }}
      >
        <div className="sidebar-sticky">
          <Logo />
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link active" href="">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Overview
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/Sales">
                <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                Sales
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/Purchases">
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Purchases
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/Financial">
                <FontAwesomeIcon icon={faPiggyBank} className="mr-2" />
                Financial
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/Inventory">
                <FontAwesomeIcon icon={faBox} className="mr-2" />
                Inventory
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/Accounts">
                <FontAwesomeIcon icon={faWallet} className="mr-2" />
                Accounts
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default SideNav;
