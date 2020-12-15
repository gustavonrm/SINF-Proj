import React, { Component } from "react";
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
  }
  render() {
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
                    <h5 className="text-muted">description</h5>
                    <BarChart2
                      title1={"Equity to Assets"}
                      title2={"Debt to Equity"}
                      title3={"COverage on fixed investments"}
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
                    <h5 className="text-muted">description</h5>
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
                    <h5 className="text-muted">description</h5>
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
  }
}

export default Financial;
