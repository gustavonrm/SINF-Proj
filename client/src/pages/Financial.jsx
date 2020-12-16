import React, { Component } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { BarChart, BarChart2, NavBar, SideNav } from "../components";
import "../style/App.css";

class Financial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      returnRatios: [],
      growthRatios: [],
      liquidity: [],
      financialStability: [],
      currentYear: 2020,
      balanceSheet: {},
      loading: false,
    };
  }
  componentDidMount() {
    fetch("http://localhost:3000/api/financial/liquidity")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          liquidity: json,
        });
      });

    fetch("http://localhost:3000/api/financial/growthRatios")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          growthRatios: json,
        });
      });

    fetch("http://localhost:3000/api/financial/returnRatios")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          returnRatios: json,
        });
      });

    fetch("http://localhost:3000/api/financial/financialStability")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          financialStability: json,
        });
      });

    fetch("http://localhost:3000/api/financial/balanceSheet")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          balanceSheet: json,
          loading: true,
        });
      });
  }

  changeYear(year) {
    if (year !== 2020) {
      this.setState({
        returnRatios: [],
        growthRatios: [],
        liquidity: [],
        financialStability: [],
        currentYear: 2020,
      });
    } else {
      this.componentDidMount();
    }
    this.setState({ currentYear: year });
  }

  render() {
    if (this.state.loading)
      return (
      <>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <SideNav page={"Financial"} />
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
                <h1 className="h2">Financial</h1>
                <div className="d-flex align-items-center">
                <a className="mr-4" href="/BalanceSheet">See Balance Sheet</a>
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
                </div>
              <section>
                <div className="row justify-content-around mx-3">
                  <article className="bg-light p-3 mb-4">
                    <h2>Return Ratios</h2>
                    <h5 className="text-muted">
                      Return on sales, assets and equity
                    </h5>
                    <BarChart
                      title1={"Return on Sales"}
                      title2={"Return on Assests"}
                      title3={"Return on Equity"}
                      data1={this.state.returnRatios.returnOnSales}
                      data2={this.state.returnRatios.returnOnAssets}
                      data3={this.state.returnRatios.returnOnEquity}
                    />
                  </article>
                  <article className="bg-light p-3 mb-4">
                    <h2>Financial Stability</h2>
                    <h5 className="text-muted">Financial stability and leverage factors</h5>
                    <BarChart2
                      title1={"Equity to Assets"}
                      title2={"Debt to Equity"}
                      title3={"Coverage on fixed investments"}
                      title4={"Interest Coverage"}
                      data1={this.state.financialStability.equityToAssets}
                      data2={this.state.financialStability.debtToEquity}
                      data3={
                        this.state.financialStability.coverageOnFixedInvestments
                      }
                      data4={this.state.financialStability.interestCoverage}
                    />
                  </article>
                </div>
                <div className="row justify-content-around mx-3">
                  <article className="bg-light p-3 mb-4">
                    <h2>Liquidity</h2>
                    <h5 className="text-muted">Liquidity ratios</h5>
                    <BarChart
                      title1={"Current Ratio"}
                      title2={"Quick Ratio"}
                      title3={"Cash Ratio"}
                      data1={this.state.liquidity.current}
                      data2={this.state.liquidity.quick}
                      data3={this.state.liquidity.cash}
                    />
                  </article>
                  <article className="bg-light p-3 mb-4">
                    <h2>Growth Ratios</h2>
                    <h5 className="text-muted">Growth ratios on profit, debt and equity</h5>
                    <BarChart
                      title1={"Profit"}
                      title2={"Debt"}
                      title3={"Equity"}
                      data1={this.state.growthRatios.profit}
                      data2={this.state.growthRatios.debt}
                      data3={this.state.growthRatios.equity}
                    />
                  </article>
                </div>
              </section>
            </main>
          </div>
          </div>
        </>
      );
    else return <> </>;
  }
}

export default Financial;
