import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import TaskAddNew from './TaskAddNew';
import TasksList from './TasksList';
import update from 'react-addons-update';

class Project extends React.Component {
  constructor(props){
    super(props);
    this.loadPage = this.loadPage.bind(this);
    this.state = {projectData: {}};
  }

  loadPage(){
    let reqParams = {
      method: 'GET',
      credentials: 'include'
    }
    let login = this.props.params.login;
    let projectID = this.props.params.projectID;

    fetch(`/api/userdata/${login}/${projectID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        let newTasks = [];
        res.tasks.map(task => {
          newTasks = [task, ...newTasks];
        })
        this.setState(res);
        let newData = update(this.state, {
          projectData: {tasks: {$set: newTasks}}
        });
        this.setState(newData);
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentWillMount(){
    this.loadPage();
  }

  handleAdding(task){
    let newData = update(this.state, {
      projectData: {tasks: {$set: [task, ...this.state.projectData.tasks]}}
    });
    this.setState(newData);
  }

  handleDeleting(taskID) {
    let newTasks = this.state.projectData.tasks.slice();
    newTasks = newTasks.filter(el => el._id !== taskID);
    let newData = update(this.state, {
      projectData: {tasks: {$set: newTasks}}
    });
    this.setState(newData);
  }

  render(){
    return <div>
            <h1> {this.state.projectData.name} </h1>
            <TaskAddNew 
              login = {this.props.params.login}
              projectID = {this.props.params.projectID}
              onAdding = {this.handleAdding.bind(this)}
            />
            <TasksList
              login = {this.props.params.login}
              projectID = {this.props.params.projectID}
              tasks = {this.state.projectData.tasks || []}
              onChildDelete = {this.handleDeleting.bind(this)}
            />
          </div>
  }
}

export default Project;