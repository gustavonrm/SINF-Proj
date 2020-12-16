import React, { Component } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { NavBar, SideNav } from "../components";
import Account from "../components/Account";
import "../style/App.css";

class Accounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receivable: 0,
      receivableGrowth: 0,
      payable: 0,
      payableGrowth: 0,
      receivableTable: [],
      payableTable: [],
      currentYear: 2020,
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/accounts/accountsReceivable")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          receivable: json.value.toFixed(2),
          receivableGrowth: json.percentage.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/accounts/accountsPayable")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          payable: json.value.toFixed(2),
          payableGrowth: json.percentage.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/accounts/payableTable")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          payableTable: json,
        });
      });

    fetch("http://localhost:3000/api/accounts/receivableTable")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          receivableTable: json,
        });
      });
  }

  changeYear(year) {
    if (year !== 2020) {
      this.setState({
        receivable: 0,
        receivableGrowth: 0,
        payable: 0,
        payableGrowth: 0,
        receivableTable: [],
        payableTable: [],
        currentYear: 2020,
      });
    } else {
      this.componentDidMount();
    }
    this.setState({ currentYear: year });
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <SideNav page={"Accounts"} />
            <main
              role="main"
              className="col-md-9 ml-sm-auto col-lg-10 px-4"
              style={{ minHeight: "100vh" }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "0px",
                  overflow: "hidden",
                  pointerEvents: "none",
                  visibility: "hidden",
                  zIndex: "-1",
                }}
                className="chartjs-size-monitor"
              ></div>
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Accounts</h1>
                <div className="dropdown show">
                  <a
                    className="btn btn-secondary dropdown-toggle"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    {this.state.currentYear}
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => this.changeYear(2020)}
                    >
                      2020
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => this.changeYear(2019)}
                    >
                      2019
                    </button>
                  </div>
                </div>
              </div>
              <div className="d-flex mx-3">
                <Account
                  title="Accounts Receivable"
                  description="Accounts Receivable value and percentage in relation to last month"
                  value={this.state.receivable}
                  growth={this.state.receivableGrowth}
                  table={this.state.receivableTable}
                />
                <Account
                  title="Accounts Payable"
                  description="Accounts Payable value and percentage in relation to last month"
                  value={this.state.payable}
                  growth={this.state.payableGrowth}
                  table={this.state.payableTable}
                />
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }
}

export default Accounts;
