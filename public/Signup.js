import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
  }

  fieldOnFocus () {
    slogin.value = '';
    spassword.value = '';
    swarn.innerHTML = '';
  }

  signUp() {
    let reqParams = {
      method: 'POST',
      headers: {  
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
      },  
      body: 'login=' + encodeURIComponent(slogin.value) +
      '&password=' + encodeURIComponent(spassword.value)
    }

    fetch('/api/signup', reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          swarn.innerHTML = res.error; 
          return;
        }
        this.fieldOnFocus();
        sOk.innerHTML = `Welcome aboard, ${res.login}! You may want to login.`                     
      })
      .catch(console.log);
  }

  render() {
    return <div className = "lpForm">
            Login: 
            <input id="slogin" onFocus={this.fieldOnFocus}/>
            Password: 
            <input type="password" id="spassword"/>
            <p><button id = "signupBtn" onClick = {this.signUp}>Sign up</button></p>         
            <div id="swarn" className ="warn"></div>  
            <div id="sOk"></div>    
          </div>
  }
}

export default Signup;
