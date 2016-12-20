import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import TasksItem from './TasksItem';
import TasksAddNew from './TasksAddNew';
import ee from './EventEmitter';

export default class TasksList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tasks: [], isEditing: null };
    this.finishChildEditing = this.finishChildEditing.bind(this);
    this.updateChild = this.updateChild.bind(this);
    this.getData = this.getData.bind(this);
  }
  
  getData (data) {
    if (!data) return;
    let newTasks = data.slice();
    newTasks = newTasks.reverse();
    this.setState({tasks: newTasks});
  }

  componentDidMount() {
    ee.addListener('taskFinishEdit', this.finishChildEditing);
    ee.addListener('taskSaveEdit', this.updateChild);
    ee.addListener('giveTasks', this.getData);
  }  

  componentWillUnmount() { 
    ee.removeListener('taskFinishEdit', this.finishChildEditing);
    ee.removeListener('taskSaveEdit', this.updateChild);
    ee.removeListener('giveTasks', this.getData);
  }

  finishChildEditing() {
    this.setState({isEditing: null});
  }

  handleAddingNew (task) {
    this.setState({tasks: [task, ...this.state.tasks] });
  }

  updateChild(itemID, newData) {
    this.state.tasks.map(el => {
      if (el._id == itemID) {
        el.name = newData.name;
        el.points = newData.points;
        el.repeated = newData.repeated;
      }
      return el;
    });
  }

  handleChildEdit(id) {
    this.setState({isEditing: id});
  }

  render () {
    return <div className = "tasksListPage">
            <div className = "listTitle">Tasks</div>
            <div className = "annotation"> 
              {`This is a list of the tasks relating to this project. Each task has a name, 
                "price" in points and repeat-mark. This button is responsible for whether 
                your task will be deleted right after completing or not.
                Earn points to "win" rewards.`}
            </div>
            <TasksAddNew 
              login = {this.props.login}
              projectID = {this.props.projectID}
              onAddingNew = {this.handleAddingNew.bind(this)}
            />
            <div className = "tasksList">
              {this.state.tasks.map((el,i,arr) => {
                let editing = this.state.isEditing == el._id;
                let cNameEdit = (editing) ? "editing" : "";
                return <TasksItem key = {arr.length - i - 1} 
                  id ={el._id} 
                  onEdit={this.handleChildEdit.bind(this)}
                  points = {el.points} 
                  name = {el.name} 
                  repeated = {el.repeated}
                  login = {this.props.login}
                  cNameEdit = {cNameEdit}
                  editing = {editing}
                  projectID = {this.props.projectID}
                />
              })}       
            </div>
          </div>
  }
}
