import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
//TODO: forms
class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className = "wantToLogin">
            { `Welcome aboard,\n${this.props.login}!\nYou may want to\n` }
             <IndexLink id = "toLogin" to="/login">log in</IndexLink>
          </div>
  }
}         

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
    this.fieldOnFocus = this.fieldOnFocus.bind(this);
    this.state = { registered: false, login: null };
    // WTF
  }

  fieldOnFocus () {
    this.refs.warn.innerHTML = '';
  }

  signUp() {
    // JSON
    let reqParams = {
      method: 'POST',
      headers: {  
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
      },  
      body: 'login=' + encodeURIComponent(this.refs.login.value) +
      '&password=' + encodeURIComponent(this.refs.password.value)
    }

    fetch('/api/signup', reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.refs.warn.innerHTML = res.error; 
          return;
        }
        this.fieldOnFocus();
        this.setState({ registered: true, login: res.login }); // ?                            
      })
      .catch(console.log);
  }

  render() {
    let readyMessage = (this.state.registered) ? <Message login = {this.state.login}/> : null;
    return <div className = "authForms">
              <div className = "lpForm">
                Login: 
                <input className="login" ref = "login" onFocus={this.fieldOnFocus}/>
                Password: 
                <input type="password" onFocus={this.fieldOnFocus} ref="password"
                  className = "password"
                />
                <div ref ="warn" className ="warn"></div>  
                <p className = "pBtn">
                  <button id = "signupBtn" onClick = {this.signUp}>Sign up</button>
                </p>         
                {readyMessage}   
              </div>
            </div>
  }
}
