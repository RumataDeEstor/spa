import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import RuleItem from './RuleItem'
import RuleAddNew from './RuleAddNew'
import ee from './EventEmitter';

export default class RuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rules: [], isEditing: null };
    this.loadRules = this.loadRules.bind(this);
    this.finishChildEditing = this.finishChildEditing.bind(this);
    this.updateChild = this.updateChild.bind(this);
    this.handleChildDelete = this.handleChildDelete.bind(this);   
  }

  loadRules() { // temp
    let reqParams = {
      method: 'GET',
      credentials: 'include'
    }

    fetch(`/api/userdata/${this.props.params.login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        let newRules = res.user.rules.reverse();
        this.setState({rules: newRules});
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    ee.addListener('ruleFinishEdit', this.finishChildEditing);
    ee.addListener('ruleSaveEdit', this.updateChild);
    ee.addListener('ruleDeleted', this.handleChildDelete);
    this.loadRules();
  } 

  componentWillUnmount() { 
    ee.removeListener('ruleFinishEdit', this.finishChildEditing);
    ee.removeListener('ruleSaveEdit', this.updateChild);
    ee.removeListener('ruleDeleted', this.handleChildDelete);
  }

  handleAddingNew(rule){
    this.setState({rules: [rule, ...this.state.rules] });
  }

  handleChildDelete(id) {
    console.log('handle del rule');
    let newRules = this.state.rules.slice();
    newRules = newRules.filter(el => el._id !== id);
    this.setState({rules: newRules});
  }

  handleChildEdit(id) {
    this.setState({isEditing: id});
  }

  updateChild(itemID, newData) {
    this.state.rules.map(el => {
      if (el._id == itemID) {
        el.name = newData.name;
        el.label = newData.label;
        el.fine = newData.fine;
      }
      return el;
    });
  }

  finishChildEditing() {
    this.setState({isEditing: null});
  }

  render () {    
    return <div> 
            <h1> under development </h1>
            <div className = "rulesListPage" style = {{opacity: "1"}}>                
                <div className = "rListTitle">Rules</div>
                <RuleAddNew
                  login = {this.props.params.login}
                  onAddingNew = {this.handleAddingNew.bind(this)}
                />
                <div className = "rulesList">
                  {
                    this.state.rules.map((el,i,arr) => {
                      let editing = (this.state.isEditing == el._id);
                      let cNameEdit = (editing) ? "editing" : "";
                      return <RuleItem key = {arr.length - i - 1} 
                        id ={el._id} 
                        name = {el.name} 
                        label = {el.label}
                        login = {this.props.params.login}
                        fine = {el.fine}
                        editing = {editing}
                        cNameEdit = {cNameEdit}
                        onEdit={this.handleChildEdit.bind(this)}
                      />
                    })
                  }        
                </div>
              </div>
            </div>
  }
}