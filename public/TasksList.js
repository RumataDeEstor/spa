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
    this.loadTasks = this.loadTasks.bind(this);
    this.finishChildEditing = this.finishChildEditing.bind(this);
    this.updateChild = this.updateChild.bind(this);
  }

  loadTasks() {
    let reqParams = {
      method: 'GET',
      credentials: 'include'
    }

    let login = this.props.login;
    let projectID = this.props.projectID;

    fetch(`/api/userdata/${login}/projects/${projectID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); 
          return;
        }
        let newTasks = res.project.tasks.reverse();
        this.setState( {tasks: newTasks} );
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    ee.addListener('taskFinishEdit', this.finishChildEditing);
    ee.addListener('taskSaveEdit', this.updateChild);
    this.loadTasks();
  }  

  componentWillUnmount() { 
    ee.removeListener('taskFinishEdit', this.finishChildEditing);
    ee.removeListener('taskSaveEdit', this.updateChild);
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
