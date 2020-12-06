import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Login, Overview, Sales, Purchases, Financial, Inventory, Accounts, MoviesList, MoviesInsert, MoviesUpdate, WIP } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/Login" exact component={Login} />
                <Route path="/" exact component={Overview} />
                <Route path="/Sales" exact component={Sales} />
                <Route path="/Purchases" exact component={Purchases} />
                <Route path="/Financial" exact component={Financial} />
                <Route path="/Inventory" exact component={Inventory} />
                <Route path="/Accounts" exact component={Accounts} />
                <Route path="/WIP" exact component={WIP} />
                <Route path="/movies/list" exact component={MoviesList} />
                <Route path="/movies/create" exact component={MoviesInsert} />
                <Route
                    path="/movies/update/:id"
                    exact
                    component={MoviesUpdate}
                />
            </Switch>
        </Router>
    )
}

export default App