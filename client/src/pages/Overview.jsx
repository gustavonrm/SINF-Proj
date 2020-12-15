import React, { Component } from "react";

import "../style/App.css";

import { LineChartOverview, InfoBox, NavBar, SideNav } from "../components";

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
        //process debts
        let currentMonth = new Date().getMonth();
        let previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        let aGrowth =
          ((json.assets[currentMonth] - json.assets[previousMonth]) /
            json.assets[currentMonth]) *
          100;
        let dGrowth =
          ((json.debts[currentMonth] - json.debts[previousMonth]) /
            json.debts[currentMonth]) *
          100;
        this.setState({
          assetsDebts: json,
          assetsGrowth: aGrowth.toFixed(2),
          debtsGrowth: dGrowth.toFixed(2),
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
              </div>
              <section className="mx-3">
                <div className="bg-light px-4 py-2 mb-4">
                  <h2>Sales vs Expenses</h2>
                  <LineChartOverview
                    height={260}
                    title1={"Sales"}
                    title2={"Expenses"}
                    data1={this.state.salesExpenses.sales}
                    data2={this.state.salesExpenses.expenses}
                  />
                </div>
                <div className="d-flex justify-content-around">
                  <div className="flex-fill mr-4">
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
                    <LineChartOverview
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
