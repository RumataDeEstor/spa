import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import TasksList from './TasksList';
import ee from './EventEmitter';

export default class Project extends React.Component {
  constructor(props){
    super(props);
    this.loadPage = this.loadPage.bind(this);
    this.getData = this.getData.bind(this);
    this.state = {};
  } 

  loadPage(){
    ee.emitEvent("reqForUserdata");
  }

  getData (data) { 
    let id = this.props.params.projectID;
    let projects = data.projects;
    let newData = {};
    projects.map((el) => {
      if (el._id == id) {
        newData = Object.assign({}, el);
        return;
      }
    });
    this.setState(newData);
    ee.emitEvent("giveTasks", [newData.tasks]);
  }

  componentDidMount(){
    ee.addListener('giveData', this.getData);
    this.loadPage();
  }

  componentWillUnmount() { 
    ee.removeListener('giveData', this.getData);
    ee.emitEvent("update");
  }

  render(){
    return <div>
            <div className = "projectName"> 
              <div className = "projectLabel" 
                style = {{backgroundColor: this.state.label}}>
              </div>
              <h1> {this.state.name}</h1>
            </div>         
            <TasksList ref = "tlist"
              login = {this.props.params.login}
              projectID = {this.props.params.projectID}
            />
          </div>
  }
}