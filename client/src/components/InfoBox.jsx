import React, { Component } from "react";

import Value from "./Value";

class InfoBox extends Component {
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
      <article className="bg-light d-flex flex-column p-4 flex-fill" style={{ maxHeight: "50vh" }}>
        <h2>{this.props.title}</h2>
        <h5 className="text-muted">{this.props.description}</h5>
        <div className="d-flex align-content-center flex-fill">
          <Value value={number} growth={this.props.growth} />
        </div>
      </article>
    );
  }
}

export default InfoBox;
