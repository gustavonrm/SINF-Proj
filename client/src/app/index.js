import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Login, Overview, Sales, Purchases, Financial, Inventory, Accounts} from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'
import { getFromStorage } from './utils/storage'

function App() {
  
    return (
        <Router>
            <Switch>
               {getFromStorage('the_main_app')=== null ? ( <> <Route path='/Login' exact component={Login} />
                <Route path='/' exact component={Login} />
                <Route path='/Sales' exact component={Login} />
                <Route path='/Purchases' exact component={Login} />
                <Route path='/Financial' exact component={Login} />
                <Route path='/Inventory' exact component={Login} />
                <Route path='/Accounts' exact component={Login} />
               
                 </>):( <><Route path='/Login' exact component={Overview} />
                <Route path='/' exact component={Overview} />
                <Route path='/Sales' exact component={Sales} />
                <Route path='/Purchases' exact component={Purchases} />
                <Route path='/Financial' exact component={Financial} />
                <Route path='/Inventory' exact component={Inventory} />
                <Route path='/Accounts' exact component={Accounts} />
               
               </>) }
                
            </Switch>
        </Router>
    )
}

export default App;
