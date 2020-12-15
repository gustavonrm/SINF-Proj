import React, { Component } from "react";

import Value from "./Value";

class Account extends Component {
  totalCost = 0.0;
  totalAmmount = 0.0;

  formatNumber(number, decimals = 1) {
    if (number == 0) return '0';

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['', 'K', 'M', 'mM', 'B', 'T', 'Q', 'P', 'H'];

    const i = Math.floor(Math.log(number) / Math.log(k));

    return `${parseFloat((number / k ** i).toFixed(dm))} ${sizes[i]}`;
  }

  render() {
    let number = 0;

    if (this.props.value !== undefined) {
      number = this.formatNumber(this.props.value)

      if (number === undefined) {
        number = 0;
      }
    }

    return (
      <section className="bg-light mr-4" style={{ width: "48%" }}>
        <article className="p-2 pb-3 mr-4 mb-4 border-bottom w-100">
          <h2>{this.props.title}</h2>
          <h5 className="text-muted">{this.props.description}</h5>
          <Value value={number} growth={this.props.growth} />
        </article>
        <article>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Account</th>
                <th scope="col">Due Date</th>
                <th scope="col">Cost Of Goods</th>
                <th scope="col">Interest</th>
                <th scope="col">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {this.props.table.map(
                (item) => (
                  (this.totalCost += item.unitCost),
                  (this.totalAmmount += item.totalCost),
                  (
                    <tr>
                      <th scope="row">{item.supplier}</th>
                      <td>
                        {item.dueDate.year}-{item.dueDate.month}-
                        {item.dueDate.day}
                      </td>
                      <td>{item.unitCost.toFixed(2)}</td>
                      <td>sei la</td>
                      <td>{item.totalCost.toFixed(2)}</td>
                    </tr>
                  )
                )
              )}
            </tbody>
            <tfoot>
              <tr>
                <th scope="col">Total</th>
                <th scope="col"></th>
                <th scope="col">{this.totalCost.toFixed(2)}</th>
                <th scope="col"></th>
                <th scope="col">{this.totalAmmount.toFixed(2)}</th>
              </tr>
            </tfoot>
          </table>
        </article>
      </section>
    );
  }
}

export default Account;
