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
    this.getData = this.getData.bind(this);
  }

  loadRules() { 
    ee.emitEvent("reqForUserdata");
  }

  getData (data) {
    let newRules = data.rules.slice();
    newRules = newRules.reverse();
    this.setState({rules: newRules});
  }

  componentDidMount() {
    ee.addListener('ruleFinishEdit', this.finishChildEditing);
    ee.addListener('ruleSaveEdit', this.updateChild);
    ee.addListener('giveData', this.getData);
    this.loadRules();
  } 

  componentWillUnmount() { 
    ee.removeListener('ruleFinishEdit', this.finishChildEditing);
    ee.removeListener('ruleSaveEdit', this.updateChild);
    ee.removeListener('giveData', this.getData);
  }

  handleAddingNew(rule){
    this.setState({rules: [rule, ...this.state.rules] });
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
            <div className = "rulesListPage" style = {{opacity: "1"}}>                
                <div className = "listTitle">Rules</div>
                <div className = "annotation">
                  {`Rules that you don't want to break. 
                    You can choose name, label for it and fine for breaking the rule.
                    If you break one, you will lose your points.`}
                </div>
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