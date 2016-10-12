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
        // redirect fetch parameter!
        if(res.ok) {
          browserHistory.push('/'); 
        }
        // ...TODO: error handling (also on server)
      })
      .catch(console.log);
  }

  render () {
    const path = `/app/${this.props.login}`;
    return <div>            
            <div className = "topmenu">
              <div id = "logo"><Link to={path}>LOGO :)</Link></div> 
              <ul className = "links">
                <li><Points login = {this.props.login} ref='foo'/></li>
                <li><IndexLink to={`${path}/projects`}>Projects</IndexLink></li>
                <li><IndexLink to={`${path}/rules`}>Rules</IndexLink></li>
                <li><IndexLink to={`${path}/promotions`}>Promotions</IndexLink></li>
                <li><button onClick = {this.logout}>
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                  </button>
                </li>
              </ul>
            </div>           
          </div>
  }
}
