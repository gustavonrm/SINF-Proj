import React, { Component } from "react";
import {
  LineChartSales,
  PieChart,
  InfoBox,
  NavBar,
  SideNav,
} from "../components";
import "../style/App.css";

class Sales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profit: 0,
      topProducts: {},
      loading: false,
      otherUnitsSold: 0.0,
      otherSales: [],
    };
  }

  async componentDidMount() {
    await fetch("http://localhost:3000/api/sales/profit")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          profit: json.value.toFixed(2),
        });
      });

    await fetch("http://localhost:3000/api/sales/topProducts")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          topProducts: json.sort((a, b) =>
            a.unitsSold > b.unitsSold ? -1 : 1
          ),
        });
      });

    //Process other products calculations
    let others = 0;
    let othersArray = [];

    for (let i = 0; i < this.state.topProducts.length; i++) {
      if (i > 4) {
        others += this.state.topProducts[i].unitsSold;

        for (let j = 0; j < this.state.topProducts[i].sales.length; j++) {
          othersArray[j] += this.state.topProducts[i].sales[j];
        }
      }
    }

    this.setState({
      otherUnitsSold: others,
      otherSales: othersArray,
    });
    this.setState({ loading: true });
  }

  render() {
    if (this.state.loading)
      return (
        <>
          <NavBar />
          <div className="container-fluid">
            <div className="row">
              <SideNav page={"Sales"} />
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
                  <h1 className="h2">Sales</h1>
                </div>
                <section>
                  <div className="px-4">
                    <div className="row px-2">
                      <InfoBox
                        title="Profit"
                        description="Average profit per sale"
                        value={this.state.profit}
                      />
                      <article className="flex-fill bg-light pl-4 pt-4 ml-4">
                        <h2>Top Sold Products</h2>
                        <div className="row justify-content-around p-2">
                          <table className="col-7 table">
                            <thead>
                              <tr>
                                <th scope="col">Item</th>
                                <th scope="col">Name</th>
                                <th scope="col">Average Cost per Item</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(this.state.topProducts).map(
                                ([key, value]) => (
                                  <tr>
                                    <th scope="row">{value.key}</th>
                                    <td>{value.name}</td>
                                    <td>
                                      {(
                                        value.sales.reduce(function (a, b) {
                                          return a + b;
                                        }, 0) / value.unitsSold
                                      ).toFixed(2)}
                                      €
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                          <PieChart
                            prodLabels={[
                              this.state.topProducts[0].key,
                              this.state.topProducts[1].key,
                              this.state.topProducts[2].key,
                              this.state.topProducts[3].key,
                              this.state.topProducts[4].key,
                              "OTHERS",
                            ]}
                            prodUnits={[
                              this.state.topProducts[0].unitsSold,
                              this.state.topProducts[1].unitsSold,
                              this.state.topProducts[2].unitsSold,
                              this.state.topProducts[3].unitsSold,
                              this.state.topProducts[4].unitsSold,
                              this.state.otherUnitsSold,
                            ]}
                          />
                        </div>
                      </article>
                    </div>
                  </div>
                  <article className="bg-light px-4 py-3 mx-3 mt-4">
                    <h2>Total Sales Volume</h2>
                    <LineChartSales
                      height={300}
                      title1={this.state.topProducts[0].key}
                      title2={this.state.topProducts[1].key}
                      title3={this.state.topProducts[2].key}
                      title4={this.state.topProducts[3].key}
                      title5={this.state.topProducts[4].key}
                      title6={"OTHERS"}
                      data1={this.state.topProducts[0].sales}
                      data2={this.state.topProducts[1].sales}
                      data3={this.state.topProducts[2].sales}
                      data4={this.state.topProducts[3].sales}
                      data5={this.state.topProducts[4].sales}
                      data6={this.state.otherSales}
                    />
                  </article>
                </section>
              </main>
            </div>
          </div>
        </>
      );
    else return <> </>;
  }
}

export default Sales;
