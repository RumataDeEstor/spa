import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import Points from './Points'

export default class InternalTopmenu extends React.Component {
  constructor(props) {
    super(props);
  }

  logout () {
    let reqParams = {
      method: 'POST',
      headers: {  
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },  
      body: 'user='+ encodeURIComponent('secret'),
      credentials: 'include'
    }

    fetch('/api/logout', reqParams)
      .then(res => {
        if(res.ok) {
          browserHistory.push('/'); 
        }
      })
      .catch(console.log);
  }

  render () {
    const path = `/app/${this.props.login}`;
    return <div>            
            <div className = "topmenu">
              <div className = "logo">
                <Link to={path}><img src = "/logo/Logo.png"/></Link>
                Goalpi
              </div> 
              <ul ref = "linksList" className = "links">
                <li><Points login = {this.props.login} ref='foo'/></li>
                <li><Link to={`${path}/projects`} activeClassName="active">Projects</Link></li>
                <li><Link to={`${path}/rules`} activeClassName="active">Rules</Link></li>
                <li><Link to={`${path}/rewards`} activeClassName="active">Rewards</Link></li>
                <li>
                  <button onClick = {this.logout}>
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                  </button>
                </li>
              </ul>
            </div>           
          </div>
  }
}
