import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';

export default class Pish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {access: false};
    this.checkAuth.bind(this);
  }   

  componentDidMount() {
    this.checkAuth().then((result) => {
      console.log(result);
      this.setState({access: result});
    });   
  }

  checkAuth(){
    let promise = new Promise((resolve, reject) => {
      let reqParams = {
      method: 'GET',
      credentials: 'include'
    }
    fetch(`/api/checkAuth`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); 
          resolve(false);
        }
        resolve(true);
      })
      .catch(err => {
        reject(err);
      })      
    })    
    return promise;
  }

  render () {    
    let content = (this.state.access) ? "Hey!" : "Bye."
    return <div id = "app">
            {content}
          </div>
  }
}
