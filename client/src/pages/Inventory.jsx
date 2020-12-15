import React, { Component } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { NavBar, SideNav, InfoBox } from "../components";
import "../style/App.css";

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inventory: 0,
      period: 0,
      turnover: 0,
      capacity: [],
      currentYear: 2020,
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

  changeYear(year) {
    if (year !== 2020) {
      this.setState({
        inventory: 0,
        period: 0,
        turnover: 0,
        capacity: [],
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
              <div className="d-flex">
                <section className="col-4 d-flex flex-column mr-2">
                  <div className="mb-4">
                    <InfoBox
                      title="Inventory in Stock"
                      description="Inventory in Stock and relation to last month"
                      value={this.state.inventory}
                    />
                  </div>
                  <div className="mb-4">
                    <InfoBox
                      title="Inventory Period"
                      description="Average time period in inventory"
                      value={this.state.period}
                    />
                  </div>
                  <div className="">
                    <InfoBox
                      title="Turnover"
                      description="Inventory replacement ratio"
                      value={this.state.turnover}
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
