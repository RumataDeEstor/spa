import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.logIn = this.logIn.bind(this);
    this.fieldOnFocus = this.fieldOnFocus.bind(this);
  }

  logIn () {
    // JSON
    let reqParams = {
      method: 'POST',
      headers: {  
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }, 
      body: 'login=' + encodeURIComponent(this.refs.login.value) +
      '&password=' + encodeURIComponent(this.refs.password.value), 
      credentials: 'include'
    }

    fetch('/api/login', reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.refs.warn.innerHTML = res.error; 
          return;
        }
        browserHistory.push(`app/${res.login}`);                    
      })
      .catch(console.log);
  }

  fieldOnFocus () {
    this.refs.warn.innerHTML = '';
  }

  render () {
    return <div className = "authForms">
              <div className = "lpForm">    
                Login: 
                <input className="login" 
                  onFocus={this.fieldOnFocus}
                  ref = "login"
                />
                Password:
                <input type="password" onFocus={this.fieldOnFocus} 
                  className="password"
                  ref = "password"
                />
                <div ref="warn" className ="warn"></div>    
                <p className = "pBtn">
                  <button id = "loginBtn" onClick={this.logIn}>Log in</button>
                </p>              
              </div>
          </div>
  }
}
