import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

export default class ProjectsItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return<div className = "ruleItem">
            <div className = "itemNormal" ref = "itemNorm">
              <div className = "checkBoxField">
              </div>
              <div className = "ruleLine">
                <div style = {{backgroundColor: this.props.label}} 
                  className = "projectLabel"> 
                </div>
                <div className = "ruleName">{this.props.name}</div>  
                <div className = "fine"> {this.props.fine}</div>
              </div>
            </div>
          </div>
  }
}