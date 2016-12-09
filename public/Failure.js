import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

export default class Failure extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return<div className  = "failure">
            <h1> Sorry! :( </h1>
            {"You can not view this page.\n"+
            "Perhaps this is a private page of another user or you are not logged in.\n"+
            "Try to log in."}
          </div>
  }
}
