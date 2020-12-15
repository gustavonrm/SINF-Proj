import React, { Component } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { InfoBox, NavBar, SideNav } from "../components";
import "../style/App.css";

class Purchase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchases: [],
      debts: [],
      totalPurchases: 0,
      totalDebts: 0,
      totalPurchasesItems: 0,
      totalDebtsItems: 0,
      currentYear: 2020,
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/purchases/purchases")
      .then((res) => res.json())
      .then((json) => {
        let purchase = 0;
        for (let i = 0; i < json.length; i++) {
          purchase += json[i].totalCost;
        }
        this.setState({
          purchases: json,
          totalPurchasesItems: purchase.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/purchases/debts")
      .then((res) => res.json())
      .then((json) => {
        let debt = 0;
        for (let i = 0; i < json.length; i++) {
          debt += json[i].totalCost;
        }
        this.setState({
          debts: json,
          totalDebtsItems: debt.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/purchases/totalPurchases")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          totalPurchases: json.value.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/purchases/totalDebts")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          totalDebts: json.value.toFixed(2),
        });
      });
  }

  changeYear(year) {
    fetch("http://localhost:3000/api/purchases/purchases/" + year)
      .then((res) => res.json())
      .then((json) => {
        let purchase = 0;
        for (let i = 0; i < json.length; i++) {
          purchase += json[i].totalCost;
        }
        this.setState({
          purchases: json,
          totalPurchasesItems: purchase.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/purchases/debts/" + year)
      .then((res) => res.json())
      .then((json) => {
        let debt = 0;
        for (let i = 0; i < json.length; i++) {
          debt += json[i].totalCost;
        }
        this.setState({
          debts: json,
          totalDebtsItems: debt.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/purchases/totalPurchases/" + year)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          totalPurchases: json.value.toFixed(2),
        });
      });

    fetch("http://localhost:3000/api/purchases/totalDebts/" + year)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          totalDebts: json.value.toFixed(2),
        });
      });

    this.setState({ currentYear: year });
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <SideNav page={"Purchases"} />
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
              <section>
                <div className="d-flex mx-3 mb-4">
                  <article className="col-8 bg-light pt-4 px-4 mr-4">
                    <h2>Purchases</h2>
                    <h5 className="text-muted">Recent purchases</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Purchase</th>
                          <th scope="col">Supplier</th>
                          <th scope="col">Date</th>
                          <th scope="col">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.purchases.map((item) => (
                          <tr>
                            <th scope="row">{item.name}</th>
                            <td>{item.supplier}</td>
                            <td>
                              {item.date.year}-{item.date.month}-{item.date.day}
                            </td>
                            <td>{item.totalCost.toFixed(2)}€</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th scope="col">Total</th>
                          <th scope="col"></th>
                          <th scope="col"></th>
                          <th scope="col">{this.state.totalPurchasesItems}€</th>
                        </tr>
                      </tfoot>
                    </table>
                  </article>
                  <InfoBox
                    title="Total Purchases"
                    description="Value of purchases in selected period"
                    value={this.state.totalPurchases}
                  />
                </div>
                <div className="d-flex mx-3">
                  <article className="col-8 bg-light pt-4 px-4 mr-4">
                    <h2>Debt to suppliers</h2>
                    <h5 className="text-muted">
                      Debt to suppliers from purchases
                    </h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Purchase</th>
                          <th scope="col">Supplier</th>
                          <th scope="col">Due Date</th>
                          <th scope="col">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.debts.map((item) => (
                          <tr>
                            <th scope="row">{item.name}</th>
                            <td>{item.supplier}</td>
                            <td>
                              {item.dueDate.year}-{item.dueDate.month}-
                              {item.dueDate.day}
                            </td>
                            <td>{item.totalCost.toFixed(2)}€</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th scope="col">Total</th>
                          <th scope="col"></th>
                          <th scope="col"></th>
                          <th scope="col">{this.state.totalDebtsItems}€</th>
                        </tr>
                      </tfoot>
                    </table>
                  </article>
                  <InfoBox
                    title="Total Debts"
                    description="Value of debt in selected period"
                    value={this.state.totalDebts}
                  />
                </div>
              </section>
            </main>
          </div>
        </div>
      </>
    );
  }
}

export default Purchase;
