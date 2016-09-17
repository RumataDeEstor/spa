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
    this.state = {};
    this.handleAdding = this.handleAdding.bind(this);
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
          tasks: {$set: newTasks}
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
     tasks: {$set: [task, ...this.state.tasks]}
    });
    this.setState(newData);
  }

  handleDeleting(taskID) {
    // let newTasks = this.state.tasks.slice();
    // newTasks = newTasks.filter(el => el._id !== taskID);
    // let newData = update(this.state, {
    //   tasks: {$set: newTasks}
    // });
    // this.setState(newData);
  }

  handleCompleting(points){
    // console.log('Project');
    // console.log(points);
    // this.props.onComplete(points);
  }

  render(){
    return <div>
            <div id = "projectName"> 
              <div id = "projectLabel" className = {this.state.label}></div>
              <h1> {this.state.name}</h1>
            </div>         
            <TaskAddNew 
              login = {this.props.params.login}
              projectID = {this.props.params.projectID}
              onAdding = {this.handleAdding.bind(this)}
            />
            <TasksList ref = "tlist"
              login = {this.props.params.login}
              projectID = {this.props.params.projectID}
              tasks = {this.state.tasks || []}
              onChildDelete = {this.handleDeleting.bind(this)}
            />
          </div>
  }
}

export default Project;