import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import App from './App';
import InternalTopmenu from './InternalTopmenu';
import Login from './Login';
import NotFound from './NotFound';
import Tasks from './Tasks';
import Project from './Project';
import Projects from './Projects';
import ProjectsAddNew from './ProjectsAddNew';
import ProjectsList from './ProjectsList';
import Signup from './Signup';
import {About, StartPage} from './StartPage';
import ProjectEditing from './ProjectEditing';
import Rules from './Rules';
import Points from './Points';

render((
  <Router history={browserHistory}>
    <Route path="/" component={StartPage}>
      <IndexRedirect to="/signup"/> 
      <Route path="/signup" component={Signup}/>
      <Route path="/login" component={Login}/>
      <Route path="/about" component={About}/>
    </Route>
    <Route path="app/:login" component={App}>
      <IndexRedirect to="projects"/> 
      <Route path="rules" component={Rules}/>
      <Route path="projects" component={Projects}>
        <IndexRedirect to="list"/> 
        <Route path="list" component={ProjectsList}/>
        <Route path="p/:projectID" component={Project}/>        
        <Route path="new" component={ProjectsAddNew}/>
      </Route>
    </Route>
    <Route path="*" component={NotFound}/>
  </Router>
), document.getElementById('root'));