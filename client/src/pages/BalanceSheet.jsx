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
      currentYear: 2020,
      balanceSheet: {},
      loading: false,
    };
  }
  componentDidMount() {
    fetch("http://localhost:3000/api/financial/balanceSheet")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          balanceSheet: json,
          loading: true,
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
    if (this.state.loading)
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
                <section>
                  <div className="bg-light px-4 py-2 mb-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Assets</th>
                          <th scope="col"></th>
                          <th scope="col">Equity and Liabilities</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Current Assets</th>
                          <td></td>
                          <th>Equity</th>
                          <td></td>
                        </tr>
                        <tr>
                          <td scope="row">Inventory</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Inventários"].toFixed(2)}
                            €
                          </td>
                          <td>Subscribed Capital</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["Capital Subscrito"].toFixed(
                              2
                            )}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Biological Assets</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Ativos Biológicos"].toFixed(2)}
                            €
                          </td>
                          <td>Own Shares</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["Ações Próprias"].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Clients</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Clientes"].toFixed(2)}
                            €
                          </td>
                          <td>Other Equity Instruments</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"][
                              "Outros Instrumentos de Capital Próprio"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">State and Other Public Entities</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Estado e Outros Entes Públicos"].toFixed(2)}
                            €
                          </td>
                          <td>Emission Rewards</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["Prémios de Emissão"].toFixed(
                              2
                            )}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Subscribed and unpaid capital</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Capital Subscrito e Não Realizado"].toFixed(2)}
                            €
                          </td>
                          <td>Legal reserves</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["Reservas legais"].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Other receivables</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Outros Créditos a Receber"].toFixed(2)}
                            €
                          </td>
                          <td>Other Reserves</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["Outras Reservas"].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Deferrals</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Diferimentos"].toFixed(2)}
                            €
                          </td>
                          <td>Transited results</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"][
                              "Resultados Transitados"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">
                            Financial Liabilities Held for Trading
                          </td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ][
                              "Ativos Financeiros Detidos para Negociação"
                            ].toFixed(2)}
                            €
                          </td>
                          <td>Transited results</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"][
                              "Resultados Transitados"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Other Financial Assets</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Outros Ativos Financeiros"].toFixed(2)}
                            €
                          </td>
                          <td>Revaluation surpluses</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"][
                              "Excedentes de Revalorização"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">
                            Non-current assets held for sale
                          </td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ][
                              "Ativos Não Correntes Detidos para Venda"
                            ].toFixed(2)}
                            €
                          </td>
                          <td>Adjustments</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["Ajustamentos"].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Cash and Bank Deposits</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Caixa e Depósitos Bancários"].toFixed(2)}
                            €
                          </td>
                          <th>Equity Total</th>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["total"].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Non Current Assets</th>
                          <td> </td>
                          <th>Liabilities</th>
                          <td></td>
                        </tr>
                        <tr>
                          <td scope="row">Tangible fixed assets</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Ativos fixos tangíveis"].toFixed(2)}
                            €
                          </td>
                          <th>Current Liabilities</th>
                          <td></td>
                        </tr>
                        <tr>
                          <td scope="row">Investment properties</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Propriedades de Investimento"].toFixed(2)}
                            €
                          </td>
                          <td>Suppliers</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Corrente"][
                              "Fornecedores"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Goodwill</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Goodwill"].toFixed(2)}
                            €
                          </td>
                          <td>Clients' Advanced Payments</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Corrente"][
                              "Adiantamentos de Clientes"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row"> Intangible assets</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Ativos intangíveis"].toFixed(2)}
                            €
                          </td>
                          <td>State and Other Public Entities</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Corrente"][
                              "Estado e Outros Entes Públicos"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row"> Biological Assets</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Ativos Biológicos"].toFixed(2)}
                            €
                          </td>
                          <td>Obtained Financing</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Corrente"][
                              "Financiamentos Obtidos"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Financial Holdings</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Participações Financeiras"].toFixed(2)}
                            €
                          </td>
                          <td>Other Payable Debts</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Corrente"][
                              "Outras Dívidas a Pagar"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Other Financial Investments</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Outros Investimentos Financeiros"].toFixed(2)}
                            €
                          </td>
                          <td>Deferrals</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Corrente"][
                              "Diferimentos"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Credits Receivable</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Créditos a Receber"].toFixed(2)}
                            €
                          </td>
                          <td>Financial Liabilities Held for Trading</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Corrente"][
                              "Passivos Financeiros Detidos para Negociação"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Deferred Tax Assets</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Ativos por Impostos Diferidos"].toFixed(2)}
                            €
                          </td>
                          <td>Other Financial Liabilities</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Corrente"][
                              "Outros Passivos Financeiros"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row"></td>
                          <td></td>
                          <td>Non-current liabilities held for sale</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Corrente"][
                              "Passivos Não Correntes Detidos para Venda"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row"></td>
                          <td></td>
                          <th>Non-current liabilities</th>
                          <td></td>
                        </tr>
                        <tr>
                          <td scope="row"></td>
                          <td></td>
                          <td>Provisions</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Não Corrente"][
                              "Provisões"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row"></td>
                          <td></td>
                          <td>Obtained Financing</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Não Corrente"][
                              "Financiamentos Obtidos"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row"></td>
                          <td></td>
                          <td>Liabilities for post-employment benefits</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Não Corrente"][
                              "Responsabilidades por benefícios pós-emprego"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row"></td>
                          <td></td>
                          <td>Deferred Tax Liabilities</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Não Corrente"][
                              "Passivos por Impostos Diferidos"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row"></td>
                          <td></td>
                          <td>Other Payable Debts</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["Passivo Não Corrente"][
                              "Outras Dívidas a Pagar"
                            ].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row"></td>
                          <td></td>
                          <th>Total Liabilities</th>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Passivo"]["total"].toFixed(2)}
                            €
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th scope="col">Total</th>
                          <th scope="col">
                            {this.state.balanceSheet["Ativos"]["total"].toFixed(
                              2
                            )}
                            €
                          </th>
                          <th scope="col">Total</th>
                          <th scope="col">
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["total"].toFixed(2)}
                            €
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>

              </main>
            </div>
          </div>
        </>
      );
    else return <> </>;
  }
}

export default BalanceSheet;
