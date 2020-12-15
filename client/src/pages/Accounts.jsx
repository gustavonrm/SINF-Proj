import React, { Component } from "react";
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
