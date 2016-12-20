import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import InternalTopmenu from './InternalTopmenu';
import RewardsShortList from './RewardsShortList';
import Failure from './Failure';
import ee from './EventEmitter';

const AppTotalContent = (props) => {
  let shouldShowShortList = (props.children.type.name !== "Rewards");
  let component = shouldShowShortList ? 
    <RewardsShortList login = {props.login}/> : null;

  return<div className = "appTotalContent">
          <InternalTopmenu login = {props.login}/>
          <div id = "appContent">
            {props.children}
            {component}
          </div>
        </div>
}

const AppContentPending = (props) => {
  
  return<div className = "appPending">
          <div>
            <i className="fa fa-refresh fa-spin fa-3x fa-fw"></i>
          </div>
        </div>
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.checkAccess = this.checkAccess.bind(this);
    this.state = {access: false, pending: true};
  } 

  componentDidMount(){
    this.checkAccess().then((result) => {
      this.setState({access: result, pending: false});
    });    
  }

  checkAccess(){
    let promise = new Promise((resolve, reject) => {
      let reqParams = {
      method: 'GET',
      credentials: 'include'
    }
    fetch(`/api/checkAccess/${this.props.params.login}`, reqParams)
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
    const access = this.state.access; 
    const pending = this.state.pending;
    let content = null;
    if (pending) {
      content = <AppContentPending/>
    } else {
      content = (access) ? 
        <AppTotalContent children = {this.props.children} 
          login = {this.props.params.login}
        /> : <Failure/>;
    }    

    return<div id = "app">           
            {content}         
          </div>
  }
}
