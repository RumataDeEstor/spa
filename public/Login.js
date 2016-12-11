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
    this.checkForm = this.checkForm.bind(this); // frontend validation
    this.checkLogin = this.checkLogin.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.printWarning = this.printWarning.bind(this);
    this.decorateFieldsOnWarnings = this.decorateFieldsOnWarnings.bind(this);
    this.parseServerErrors = this.parseServerErrors.bind(this);
  }

  componentDidMount () {
    this.refs.loginForm.addEventListener('submit',this.checkForm, false);
    this.refs.login.addEventListener('input', this.checkLogin, false);
    this.refs.password.addEventListener('input', this.checkPassword, false);
  }

  checkForm (e) {
    e.preventDefault();
    if ( this.checkLogin() && 
      this.checkPassword() ) this.logIn();
  }

  parseServerErrors (msg) {
    let warning = "";
    if (msg == 'Incorrect username.'|| 'Incorrect password.')  {
      warning = "Wrong login or password.";
    } else {
      console.log(msg);
      return;
    }
    this.printWarning(warning, this.refs.passWarn, this.refs.password);
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

  logIn () {

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

    fetch('/api/login', reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.parseServerErrors(res.error); 
          return;
        }
        browserHistory.push(`app/${res.login}`);                    
      })
      .catch(console.log);
  }

  render () {
    return <div className = "authForms">
              <form className = "lpForm" ref = "loginForm">    
                Login: 
                <input className="login" 
                  ref = "login"
                  name = "login"
                />
                <div ref="loginWarn" className ="warn"></div>
                Password:
                <input type="password" 
                  className="password"
                  ref = "password"
                  name = "password"
                />
                <div ref="passWarn" className ="warn"></div>   
                <p className = "pBtn">
                  <input type = "submit" id = "loginBtn" value = "Log in"/>
                </p>              
              </form>
          </div>
  }
}
