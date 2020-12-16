import React, { Component } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { BarChart, BarChart2, NavBar, SideNav } from "../components";
import "../style/App.css";

class Financial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      returnRatios: [],
      growthRatios: [],
      liquidity: [],
      financialStability: [],
      currentYear: 2020,
      balanceSheet: {},
      loading: false,
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
                  <h1 className="h2">Financial</h1>
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
                    <h2>Balance Sheet</h2>
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
                          <td>Capital Subscrito</td>
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
                          <td>Ações Próprias</td>
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
                          <td> Outros Instrumentos de Capital Próprio</td>
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
                          <td scope="row">Estado e Outros Entes Públicos</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Estado e Outros Entes Públicos"].toFixed(2)}
                            €
                          </td>
                          <td>Prémios de Emissão</td>
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
                          <td scope="row">Capital Subscrito e Não Realizado</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Capital Subscrito e Não Realizado"].toFixed(2)}
                            €
                          </td>
                          <td>Reservas legais</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["Reservas legais"].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Outros Créditos a Receber</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Outros Créditos a Receber"].toFixed(2)}
                            €
                          </td>
                          <td>Outras Reservas</td>
                          <td>
                            {" "}
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["Outras Reservas"].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Diferimentos</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Diferimentos"].toFixed(2)}
                            €
                          </td>
                          <td>Resultados Transitados</td>
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
                            Ativos Financeiros Detidos para Negociação
                          </td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ][
                              "Ativos Financeiros Detidos para Negociação"
                            ].toFixed(2)}
                            €
                          </td>
                          <td>Resultados Transitados</td>
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
                          <td scope="row">Outros Ativos Financeiros</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ]["Outros Ativos Financeiros"].toFixed(2)}
                            €
                          </td>
                          <td>Excedentes de Revalorização</td>
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
                            Ativos Não Correntes Detidos para Venda
                          </td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Corrente"
                            ][
                              "Ativos Não Correntes Detidos para Venda"
                            ].toFixed(2)}
                            €
                          </td>
                          <td>Ajustamentos</td>
                          <td>
                            {this.state.balanceSheet[
                              "Capital Próprio e Passivo"
                            ]["Capital Próprio"]["Ajustamentos"].toFixed(2)}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Caixa e Depósitos Bancários</td>
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
                          <td scope="row">Ativos fixos tangíveis</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Ativos fixos tangíveis"].toFixed(2)}
                            €
                          </td>
                          <th>Passivo Corrente</th>
                          <td></td>
                        </tr>
                        <tr>
                          <td scope="row">Propriedades de Investimento</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Propriedades de Investimento"].toFixed(2)}
                            €
                          </td>
                          <td>Fornecedores</td>
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
                          <td>Adiantamentos de Clientes</td>
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
                          <td scope="row"> Ativos intangíveis</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Ativos intangíveis"].toFixed(2)}
                            €
                          </td>
                          <td>Estado e Outros Entes Públicos</td>
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
                          <td scope="row"> Ativos Biológicos</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Ativos Biológicos"].toFixed(2)}
                            €
                          </td>
                          <td>Financiamentos Obtidos</td>
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
                          <td scope="row">Participações Financeiras</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Participações Financeiras"].toFixed(2)}
                            €
                          </td>
                          <td>Outras Dívidas a Pagar</td>
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
                          <td scope="row">Outros Investimentos Financeiros</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Outros Investimentos Financeiros"].toFixed(2)}
                            €
                          </td>
                          <td>Diferimentos</td>
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
                          <td scope="row">Créditos a Receber</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Créditos a Receber"].toFixed(2)}
                            €
                          </td>
                          <td>Passivos Financeiros Detidos para Negociação</td>
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
                          <td scope="row">Ativos por Impostos Diferidos</td>
                          <td>
                            {this.state.balanceSheet["Ativos"][
                              "Ativo Não Corrente"
                            ]["Ativos por Impostos Diferidos"].toFixed(2)}
                            €
                          </td>
                          <td>Outros Passivos Financeiros</td>
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
                          <td>Passivos Não Correntes Detidos para Venda</td>
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
                          <th>Passivo Não Corrente</th>
                          <td></td>
                        </tr>
                        <tr>
                          <td scope="row"></td>
                          <td></td>
                          <td>Provisões</td>
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
                          <td>Financiamentos Obtidos</td>
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
                          <td>Responsabilidades por benefícios pós-emprego</td>
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
                          <td>Passivos por Impostos Diferidos</td>
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
                          <td>Outras Dívidas a Pagar</td>
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
                          <th>Passivo Total</th>
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
                  <div className="row justify-content-around mx-3">
                    <article className="bg-light p-3 mb-4">
                      <h2>Return Ratios</h2>
                      <h5 className="text-muted">
                        Return on sales, assets and equity
                      </h5>
                      <BarChart
                        title1={"Return on Sales"}
                        title2={"Return on Assests"}
                        title3={"Return on Equity"}
                        data1={this.state.returnRatios.returnOnSales}
                        data2={this.state.returnRatios.returnOnAssets}
                        data3={this.state.returnRatios.returnOnEquity}
                      />
                    </article>
                    <article className="bg-light p-3 mb-4">
                      <h2>Financial Stability</h2>
                      <h5 className="text-muted">
                        Financial stability and leverage factors
                      </h5>
                      <BarChart2
                        title1={"Equity to Assets"}
                        title2={"Debt to Equity"}
                        title3={"Coverage on fixed investments"}
                        title4={"Interest Coverage"}
                        data1={this.state.financialStability.equityToAssets}
                        data2={this.state.financialStability.debtToEquity}
                        data3={
                          this.state.financialStability
                            .coverageOnFixedInvestments
                        }
                        data4={this.state.financialStability.interestCoverage}
                      />
                    </article>
                  </div>
                  <div className="row justify-content-around mx-3">
                    <article className="bg-light p-3 mb-4">
                      <h2>Liquidity</h2>
                      <h5 className="text-muted">Liquidity ratios</h5>
                      <BarChart
                        title1={"Current Ratio"}
                        title2={"Quick Ratio"}
                        title3={"Cash Ratio"}
                        data1={this.state.liquidity.current}
                        data2={this.state.liquidity.quick}
                        data3={this.state.liquidity.cash}
                      />
                    </article>
                    <article className="bg-light p-3 mb-4">
                      <h2>Growth Ratios</h2>
                      <h5 className="text-muted">
                        Growth ratios on profit, debt and equity
                      </h5>
                      <BarChart
                        title1={"Profit"}
                        title2={"Debt"}
                        title3={"Equity"}
                        data1={this.state.growthRatios.profit}
                        data2={this.state.growthRatios.debt}
                        data3={this.state.growthRatios.equity}
                      />
                    </article>
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

export default Financial;
