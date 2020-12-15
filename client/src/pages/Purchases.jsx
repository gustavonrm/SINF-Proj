import React, { Component } from "react";
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
                            <td>{item.totalCost.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th scope="col">Total</th>
                          <th scope="col"></th>
                          <th scope="col"></th>
                          <th scope="col">{this.state.totalPurchasesItems}</th>
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
                          <th scope="col">Date</th>
                          <th scope="col">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">ID_65421</th>
                          <td>Ream of paper (Grade A)</td>
                          <td>@mdo</td>
                          <td>1000</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>1000</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Larry</td>
                          <td>the Bird</td>
                          <td>1000</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Larry</td>
                          <td>the Bird</td>
                          <td>1000</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th scope="col">Total</th>
                          <th scope="col"></th>
                          <th scope="col"></th>
                          <th scope="col">Total Amount</th>
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
