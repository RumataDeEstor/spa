import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import ee from './EventEmitter';

export default class Stats extends React.Component {
  constructor(props) {
    super(props);
    
  }

  componentDidMount(){
  }

  componentWillUnmount() {
  }

  render () {
    return <div className = "statsPage">
            <h1> In development </h1>
          </div>
  }
}