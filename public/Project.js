import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import TasksList from './TasksList';
import update from 'react-addons-update';

export default class Project extends React.Component {
  constructor(props){
    super(props);
    this.loadPage = this.loadPage.bind(this);
    this.state = {};
  } 

  loadPage(){
    let reqParams = {
      method: 'GET',
      credentials: 'include'
    }
    let login = this.props.params.login;
    let projectID = this.props.params.projectID;

    fetch(`/api/userdata/${login}/projects/${projectID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); 
          return;
        }
        let proj = res.project;
        let newState = { _id: proj._id, label: proj.label, name: proj.name };
        this.setState(newState);
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount(){
    this.loadPage();
  }

  render(){
    return <div>
            <div className = "projectName"> 
              <div className = "projectLabel" style = {{backgroundColor: this.state.label}}></div>
              <h1> {this.state.name}</h1>
            </div>         
            <TasksList ref = "tlist"
              login = {this.props.params.login}
              projectID = {this.props.params.projectID}
            />
          </div>
  }
}