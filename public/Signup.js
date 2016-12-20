import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

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
    this.state = { registered: false, login: null };
    this.checkForm = this.checkForm.bind(this); 
    this.checkLogin = this.checkLogin.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.printWarning = this.printWarning.bind(this);
    this.decorateFieldsOnWarnings = this.decorateFieldsOnWarnings.bind(this);
    this.parseServerErrors = this.parseServerErrors.bind(this);
  }

  componentDidMount(){
    this.refs.signupForm.addEventListener('submit',this.checkForm, false);
    this.refs.login.addEventListener('input', this.checkLogin, false);
    this.refs.password.addEventListener('input', this.checkPassword, false);
  }

  componentWillUnmount () {
    this.refs.signupForm.removeEventListener('submit',this.checkForm, false);
    this.refs.login.removeEventListener('input', this.checkLogin, false);
    this.refs.password.removeEventListener('input', this.checkPassword, false);
  }

  checkForm (e) {
    e.preventDefault();
    if ( this.checkLogin() && 
      this.checkPassword() ) this.signUp();
  }

  parseServerErrors (msg) {
    let warning = "";
    if (msg == 'duplicate')  {
      warning = "Login already in use. Get creative. :)";
    } else {
      console.log(msg);
      return;
    }
    this.printWarning(warning, this.refs.loginWarn, this.refs.login);
  }

  checkLogin(e) {
    let login = (e) ? e.target.value : this.refs.login.value;
    let warning = "";
    let isAccepted = false;
    if (login.length < 4) {
      warning = `Login is too short. You need more than 3 characters.`;
    } else if (login.length > 20) {
      warning = `Login is too long. You need less than 21 characters.`;
    } else if (!/^\w+$/.test(login)) {
      warning = `Only Latin letters, digits and "_", please.`;
    } else if (!/^[a-zA-Z]\w+$/.test(login)) {
      warning = `The 1st character must be a letter.`;
    } else {
      warning = "";
      isAccepted = true;
    }
    this.printWarning(warning, this.refs.loginWarn, this.refs.login);
    return isAccepted; 
  }

  checkPassword(e) {
    let password = (e) ? e.target.value : this.refs.password.value;
    let warning = "";
    let isAccepted = false;
    if (password.length < 6) {
      warning = `Password is too short. You need more than 5 characters.`;
    } else if (password.length > 20) {
      warning = `Password is too long. You need less than 21 characters.`;
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/.test(password)) {
      warning = `Upper and lowercase Latin letters and numbers required
        (at least 1 character of each type).`;
    } else {
      warning = "";
      isAccepted = true;
    }
    this.printWarning(warning, this.refs.passWarn, this.refs.password);
    return isAccepted; 
  }

  decorateFieldsOnWarnings(isToDecorate, field) {
    let borderStyle = (isToDecorate) ?
      "2px ridge #E33B35" : "1px ridge #cdcfd2";
    field.style.border = borderStyle;
    field.style.marginBottom = (isToDecorate) ? "0" : "2px";
  }

  printWarning(warning, warnField, decorateField) {
    if (!warning) {
      warnField.innerHTML = "";
      this.decorateFieldsOnWarnings(false, decorateField);
      return;
    }
    warnField.innerHTML = `<i class="fa fa-exclamation-triangle" 
      aria-hidden="true"></i>${warning}`;
    this.decorateFieldsOnWarnings(true, decorateField);
  }

  signUp() {
    
    let bodyJSON = JSON.stringify({
      login: this.refs.login.value,
      password: this.refs.password.value
    });

    let reqParams = {
      method: 'POST',
      headers: {  
        "Content-type": "application/json; charset=UTF-8"  
      },
      credentials: 'include',
      body: bodyJSON
    }        

    fetch('/api/signup', reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.parseServerErrors(res.error); 
          return;
        }
        this.setState({ registered: true, login: res.login });                          
      })
      .catch(console.log);
  }

  render() {
    let readyMessage = (this.state.registered) ? <Message login = {this.state.login}/> : null;
    return <div className = "authForms">
              <form className = "lpForm" ref = "signupForm">
                Login: 
                <input className="login" ref = "login"/>
                <div ref="loginWarn" className ="warn"></div>
                Password: 
                <input type="password" ref="password"
                  className = "password"
                />
                <div ref="passWarn" className ="warn"></div>   
                <p className = "pBtn">
                  <input type = "submit" id = "signupBtn" value = "Sign up"/>
                </p>         
                {readyMessage}   
              </form>
            </div>
  }
}
