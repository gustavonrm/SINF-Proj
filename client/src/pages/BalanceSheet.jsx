import React, { Component } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { BarChart, BarChart2, NavBar, SideNav } from "../components";
import "../style/App.css";

class BalanceSheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      returnRatios: [],
      growthRatios: [],
      liquidity: [],
      financialStability: [],
      currentYear: 2020,
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
                <h1 className="h2">Balance Sheet</h1>
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
              
            </main>
          </div>
        </div>
      </>
    );
  }
}

export default BalanceSheet;
