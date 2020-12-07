import React, { Component } from "react";

import Value from "./Value";

class InfoBox extends Component {

    render() {
        return (
            <section className="bg-light p-4 mb-4">
                <h2>{this.props.title}</h2>
                <h5 className="text-muted">{this.props.description}</h5>
                <Value value="17000" growth="12.0" />
            </section>
        );
    }
}

export default InfoBox;
