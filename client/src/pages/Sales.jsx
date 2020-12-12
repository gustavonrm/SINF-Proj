import React, { Component } from "react";
import api from "../api";
import { LineChart, PieChart, InfoBox, NavBar, SideNav } from "../components";
import "../style/App.css";

class Sales extends Component {
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
            <SideNav page={"Sales"} />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4" style={{ minHeight: "100vh" }}>
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
                <h1 className="h2">Sales</h1>
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
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    This week
                  </button>
                </div>
              </div>
              <section>
                <div className="px-4">
                  <div className="row px-2">
                    <InfoBox title="Profit" description="Average profit per sale"/>
                    <article className="flex-fill bg-light pl-4 pt-4 ml-4">
                      <h2>Top Sold Products</h2>
                      <div className="row justify-content-around p-2">
                        <table class="col-7 table">
                          <thead>
                            <tr>
                              <th scope="col">Item</th>
                              <th scope="col">Name</th>
                              <th scope="col">Average Cost per Item</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th scope="row">ID_65421</th>
                              <td>Ream of paper (Grade A)</td>
                              <td>Otto</td>
                            </tr>
                            <tr>
                              <th scope="row">2</th>
                              <td>Jacob</td>
                              <td>Thornton</td>
                            </tr>
                            <tr>
                              <th scope="row">3</th>
                              <td>Larry</td>
                              <td>the Bird</td>
                            </tr>
                            <tr>
                              <th scope="row">3</th>
                              <td>Larry</td>
                              <td>the Bird</td>
                            </tr>
                            <tr>
                              <th scope="row">3</th>
                              <td>Larry</td>
                              <td>the Bird</td>
                            </tr>
                          </tbody>
                        </table>
                        <PieChart />
                      </div>
                    </article>
                  </div>
                </div>
                <article className="bg-light px-4 py-3 mx-3 mt-4">
                  <h2>Total Sales Volume</h2>
                  <LineChart height={300}/>
                </article>
              </section>
            </main>
          </div>
        </div>
      </>
    );
  }
}

export default Sales;
