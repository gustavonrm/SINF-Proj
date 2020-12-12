import React , {Component} from "react";

import Value from "./Value";

class Account extends Component {

    render() {
        return (
            <section className="bg-light mr-4" style={{width: "48%"}}>
                <article className="p-2 pb-3 mr-4 mb-4 border-bottom w-100">
                    <h2>{this.props.title}</h2>
                    <h5 className="text-muted">{this.props.description}</h5>
                    <Value value="17000" growth="12.0"/>
                </article>
                <article>
                    <table class="table">
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
                            <tr>
                                <th scope="row"></th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                            </tr>
                            
                        </tbody>
                        <tfoot>
                            <tr>
                                <th scope="col">Total</th>
                                <th scope="col"></th>
                                <th scope="col">Cost Of Goods</th>
                                <th scope="col">Interest</th>
                                <th scope="col">Total Amount</th>
                            </tr>
                        </tfoot>
                    </table>

                </article>
            </section>
        );
    }
}

export default Account;
