import React, { Component } from "react";
import api from "../api";

import "../style/App.css";

import { LineChart, InfoBox, NavBar, SideNav } from "../components";

class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalAssets: 0,
      totalDebts: 0,
      assetsGrowth: 0.0,
      debtsGrowth: 0.0,
      salesExpenses: {},
      assetsDebts: {},
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/overview/totalAssets")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          totalAssets: json.value.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/overview/totalDebts")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          totalDebts: json.value.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/overview/assetsDebts")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          assetsDebts: json,
        });
      });

    fetch("http://localhost:3000/api/overview/salesExpenses")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          salesExpenses: json,
        });
      });
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <SideNav page={"Overview"} />
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
                <h1 className="h2">Purchases</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                  <div className="btn-group mr-2">
                    <button className="btn btn-sm btn-outline-secondary">
                      Share
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Export
                    </button>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="feather feather-calendar"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    This week
                  </button>
                </div>
              </div>
              <section className="mx-3">
                <div className="bg-light px-4 py-2 mb-4">
                  <h2>Sales vs Expenses</h2>
                  <LineChart
                    height={260}
                    title1={"Sales"}
                    title2={"Expenses"}
                    data1={this.state.salesExpenses.sales}
                    data2={this.state.salesExpenses.expenses}
                  />
                </div>
                <div className="d-flex justify-content-around">
                  <div>
                    <div className="pb-4">
                      <InfoBox
                        title="Total Assets"
                        value={this.state.totalAssets}
                        growth={this.state.assetsGrowth}
                      />
                    </div>
                    <InfoBox
                      title="Total Debt"
                      value={this.state.totalDebts}
                      growth={this.state.debtsGrowth}
                    />
                  </div>
                  <div className="col-8 bg-light px-4 py-2">
                    <h2>Assets vs Debt</h2>
                    <LineChart
                      height={350}
                      title1={"Assests"}
                      title2={"Debts"}
                      data1={this.state.assetsDebts.assets}
                      data2={this.state.assetsDebts.debts}
                    />
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </>
    );
  }
}

export default Overview;
