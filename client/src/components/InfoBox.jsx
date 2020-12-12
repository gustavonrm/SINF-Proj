import React, { Component } from "react";

import Value from "./Value";

class InfoBox extends Component {

    render() {
        return (
            <article className="bg-light d-flex flex-column p-4">
                <h2>{this.props.title}</h2>
                <h5 className="text-muted">{this.props.description}</h5>
                <div className="d-flex align-content-center flex-fill">
                    <Value value="17000" growth="12.0" />
                </div>
            </article>
        );
    }
}

export default InfoBox;
