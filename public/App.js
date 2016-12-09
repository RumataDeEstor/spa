import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import InternalTopmenu from './InternalTopmenu';
import PromotionsShortList from './PromotionsShortList';
import Failure from './Failure';
import ee from './EventEmitter';

const AppTotalContent = (props) => {
  let shouldShowShortList = (props.children.type.name !== "Promotions");
  let component = shouldShowShortList ? 
    <PromotionsShortList login = {props.login}/> : null;

  return<div className = "appTotalContent">
          <InternalTopmenu login = {props.login}/>
          <div id = "appContent">
            {props.children}
            {props.component}
          </div>
        </div>
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.checkAccess = this.checkAccess.bind(this);
    this.state = {access: false};
  } 

  componentDidMount(){
    this.checkAccess().then((result) => {
      console.log()
      this.setState({access: result});
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
 
  // //todo: DidMount - fetch to check Auth; if not user page, forbidden, redirect.

  render () {
    const access = this.state.access; 
    const content = (access) ? 
      <AppTotalContent children = {this.props.children} 
        login = {this.props.params.login}
      /> : <Failure/>;

    return<div id = "app">           
            {content}         
          </div>
  }
}
