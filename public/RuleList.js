import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import RuleItem from './RuleItem'

export default class RuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rules: [] };
    this.loadRules = this.loadRules.bind(this);
  }

  loadRules() { // temp
    let rule1 = {
      _id: "001",
      name: 'No rat',
      label: "red",
      fine: 2
    };

    let rule2 = {
      _id: "002",
      name: 'Let it be!',
      label: "green",
      fine: 5
    };

    let arr = [rule1, rule2];

    this.setState({rules: arr});
  }

  componentWillMount() {
    this.loadRules();
  }

  render () {    
    return<div className = "rulesList">
            {
              this.state.rules.map((el,i,arr) => {
                return <RuleItem key = {arr.length - i - 1} 
                  id ={el._id} 
                  name = {el.name} 
                  label = {el.label}
                  login = {this.props.params.login}
                  fine = {el.fine}
                />
              })
            }        
          </div>
  }
}