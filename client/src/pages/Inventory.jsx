import React, { Component } from "react";
import api from "../api";
import { Content, NavBar, SideNav, InfoBox } from "../components";
import "../style/App.css";

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inventory: 0,
      inventoryGrowth: 0.0,
      period: 0,
      periodGrowth: 0.0,
      turnover: 0,
      turnoverGrowth: 0.0,
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/inventory/stock")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          inventory: json.value.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/inventory/period")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          period: json.value.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/inventory/turnover")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          turnover: json.value.toFixed(2),
        });
      });
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <SideNav page={"Inventory"} />
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
                <h1 className="h2">Inventory</h1>
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
              <div className="d-flex">
                <section className="col-4 d-flex flex-column mr-2">
                  <div className="mb-4">
                    <InfoBox
                      title="Inventory in Stock"
                      description="Inventory in Stock and relation to last month"
                      value={this.state.inventory}
                      growth={this.state.inventoryGrowth}
                    />
                  </div>
                  <div className="mb-4">
                    <InfoBox
                      title="Inventory Period"
                      description="Average time period in inventory"
                      value={this.state.period}
                      growth={this.state.periodGrowth}
                    />
                  </div>
                  <div className="">
                    <InfoBox
                      title="Turnover"
                      description="Inventory replacement ratio"
                      value={this.state.turnover}
                      growth={this.state.turnoverGrowth}
                    />
                  </div>
                </section>
                <div className="col-8 bg-light">
                  <section className="p-4 mb-4">
                    <h2>Number of Items in Stock</h2>
                    <h5 className="text-muted"></h5>
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">Item</th>
                          <th scope="col">Name</th>
                          <th scope="col">Average Cost per Item</th>
                          <th scope="col">Average Inventory Period</th>
                          <th scope="col">Inventory Turnover</th>
                          <th scope="col">Total Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">ID_65421</th>
                          <td>Ream of paper (Grade A)</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                          <td>@mdo</td>
                          <td>1000</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@fat</td>
                          <td>1000</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Larry</td>
                          <td>the Bird</td>
                          <td>@twitter</td>
                          <td>@twitter</td>
                          <td>1000</td>
                        </tr>
                      </tbody>
                    </table>
                  </section>
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }
}

export default Inventory;
