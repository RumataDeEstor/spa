import React from 'react'
import Points from './Points'
import { Link } from 'react-router'

const InternalTopmenu = ({ login }) => {
  const path = `/app/${login}`;
  return<div>            
          <div className = "topmenu">
            <div className = "logo">
              <Link to={path}><img src = "/logo/Logo.png"/></Link>
              Goalpi
            </div> 
            <ul className = "links">
              <li><Points login = {login} points = "100"/></li>
              <li><Link to={`${path}/projects`} activeClassName="active">Projects</Link></li>
              <li><Link to={`${path}/rules`} activeClassName="active">Rules</Link></li>
              <li><Link to={`${path}/rewards`} activeClassName="active">Rewards</Link></li>
              <li><Link to={`${path}/stats`} activeClassName="active">Stats</Link></li>
              <li>
                <button>
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                </button>
              </li>
            </ul>
          </div>           
        </div>
} 

InternalTopmenu.propTypes = {
  login: React.PropTypes.string
};

export default InternalTopmenu;
