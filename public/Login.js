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
    this.checkForm = this.checkForm.bind(this); 
    this.checkLogin = this.checkLogin.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.printWarning = this.printWarning.bind(this);
    this.decorateFieldsOnWarnings = this.decorateFieldsOnWarnings.bind(this);
    this.parseServerErrors = this.parseServerErrors.bind(this);
    this.clearLoginWarn = this.clearLoginWarn.bind(this);
    this.clearPassWarn = this.clearPassWarn.bind(this);
  }

   componentDidMount () {
    this.refs.loginForm.addEventListener('submit',this.checkForm, false);
    this.refs.login.addEventListener('input', this.clearLoginWarn, false);
    this.refs.password.addEventListener('input', this.clearPassWarn, false);
  }

  componentWillUnmount () {
    this.refs.loginForm.removeEventListener('submit',this.checkForm, false);
    this.refs.login.removeEventListener('input', this.checkLogin, false);
    this.refs.password.removeEventListener('input', this.checkPassword, false);
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

  checkLogin() {
    let login = this.refs.login.value;
    let warning = "";
    let isAccepted = false;
    if (!/^\w+$/.test(login)) {
      warning = `Valid login required.`;
    } else {
      warning = "";
      isAccepted = true;
    }
    this.printWarning(warning, this.refs.loginWarn, this.refs.login);
    return isAccepted; 
  }

  checkPassword() {
    let password = this.refs.password.value;
    let warning = "";
    let isAccepted = false;
    if ( (password.length < 6) || (!/^\w+$/.test(password)) ) {
      warning = `Valid password required.`;
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
      if (warnField == this.refs.loginWarn) {
        this.clearLoginWarn();
      } else {
        this.clearPassWarn();
      }
      return;
    }

    warnField.innerHTML = `<i class="fa fa-exclamation-triangle" 
      aria-hidden="true"></i>${warning}`;
    this.decorateFieldsOnWarnings(true, decorateField);
  }

  clearPassWarn () {
    this.refs.passWarn.innerHTML = "";
    this.decorateFieldsOnWarnings(false, this.refs.password);
  }

  clearLoginWarn () {
    this.refs.loginWarn.innerHTML = "";
    this.decorateFieldsOnWarnings(false, this.refs.login);
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
