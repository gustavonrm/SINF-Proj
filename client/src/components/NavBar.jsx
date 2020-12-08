import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import '../style/NavBar.css';

import { getFromStorage, setInStorage } from '../app/utils/storage';

class NavBar extends Component {
  state = {};

  render() {
    return (
      <>
        <nav className='navbar fixed-top flex-md-nowrapshadow'>
          <div>360º DashBoard</div>
          <ul class='navbar-nav px-3'>
            <li className='nav-item text-nowrap'>
              <button className='nav-link logout-btn' onClick={this.logout}>
                Logout
                <FontAwesomeIcon icon={faSignOutAlt} className='ml-2' />
              </button>
            </li>
          </ul>
        </nav>
      </>
    );
  }

  logout() {
    console.log('logout');
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('http://localhost:3000/api/auth/logout?token=' + token)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setInStorage('the_main_app', null);
            window.location.href = '/login';
          }
        });
    }
  }
}

export default NavBar;
