import React, { Component } from "react";
import { NavBar, SideNav, InfoBox } from "../components";
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
      capacity: [],
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

    fetch("http://localhost:3000/api/inventory/capacity")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          capacity: json.sort((a, b) => (a.quantity > b.quantity ? -1 : 1)),
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
                    <table className="table">
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
                        {this.state.capacity.map((item) => (
                          <tr>
                            <th scope="row">{item.key}</th>
                            <td>{item.description}</td>
                            <td>{item.unitCost}€</td>
                            <td>{item.invPeriod.toFixed(2)}</td>
                            <td>{item.turnover.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                          </tr>
                        ))}
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
