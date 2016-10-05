import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import Points from './Points';

export default class Rules extends React.Component {
  constructor(props) {
    super(props);
  }  
  
  render () {
    //TODO
    return <div>
            <div id = "rulesList">
              <div id = "ruleItem">
                <div id = "back">!</div>
                <div id = "itemText">
                  Не забывать уносить тарелки сразу после еды.
                </div>
                <div id = "fine">
                  200
                </div>
                <button id = "break">Break!</button>
              </div>
            </div>
          </div>
  }
}
