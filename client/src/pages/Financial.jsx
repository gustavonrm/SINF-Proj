import React, { Component } from "react";
import { BarChart, NavBar, SideNav } from "../components";
import "../style/App.css";

class Financial extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
                    <BarChart />
                  </article>
                  <article className="bg-light p-3 mb-4">
                    <h2>Financial Stability</h2>
                    <h5 className="text-muted">description</h5>
                    <BarChart />
                  </article>
                </div>
                <div className="row justify-content-around mx-3">
                  <article className="bg-light p-3 mb-4">
                    <h2>Liquidity</h2>
                    <h5 className="text-muted">description</h5>
                    <BarChart />
                  </article>
                  <article className="bg-light p-3 mb-4">
                    <h2>Growth Ratios</h2>
                    <h5 className="text-muted">description</h5>
                    <BarChart />
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
