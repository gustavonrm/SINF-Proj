import React, { Component } from "react";

import Value from "./Value";

class Account extends Component {
  totalCost = 0.0;
  totalAmmount = 0.0;

  render() {
    return (
      <section className="bg-light mr-4" style={{ width: "48%" }}>
        <article className="p-2 pb-3 mr-4 mb-4 border-bottom w-100">
          <h2>{this.props.title}</h2>
          <h5 className="text-muted">{this.props.description}</h5>
          <Value value={this.props.value} growth={this.props.growth} />
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
                      <td>{item.unitCost}</td>
                      <td>sei la</td>
                      <td>{item.totalCost}</td>
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
