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
import Projects from './Projects';
import ProjectsAddNew from './ProjectsAddNew';
import ProjectsList from './ProjectsList';
import Signup from './Signup';
import {About, StartPage} from './StartPage';
import ProjectEditing from './ProjectEditing';



class Secret extends React.Component {
  constructor(props) {
    super(props);
    this.state = {secrets: []};
  }
  componentDidMount () {
    let reqParams = {
      method: 'GET',
      headers: {  
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
      }, 
      credentials: 'include'
    }

    fetch('/api/secretRoute', reqParams)
      .then(res => res.json())
      .then(res => {
        if (!res.error) {
          this.setState( {secrets: [...this.state.secrets, 
          res.message]} );
        } else {
          console.log(res.error);
        }
      })
      .catch(console.log);
  }
  render () {
    return <div> 
      Secret!
      {this.state.secrets.length}
      </div>
  }
}

class Userdata extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projects: []};
    this.addProj = this.addProj.bind(this);
  }

  chooseProj(e) {
    e.target.className = 'chosen';  
  }

  addProj () {
    let reqParams = {
      method: 'POST',
      headers: {  
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
      },  
      body: 'project=' + encodeURIComponent(field.value),
      credentials: 'include'
    }
    fetch(`/api/userdata/${this.props.routeParams.login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (!res.error) {
          return res._id;
        }
      })
      .then(_id => {
        this.setState( {projects: [...this.state.projects, 
        {name: field.value, _id: _id}]} );
      })
      .catch(console.log);        
  }

  componentDidMount () {
    let reqParams = {
      method: 'GET',
      headers: {  
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
      },
      credentials: 'include'
    } 
    fetch(`/api/userdata/${this.props.routeParams.login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (!res.error) {
          res.map(elem => {
            this.setState( {projects: [...this.state.projects, 
            {name: elem.name, _id: elem._id}]} );
          })
          return;
        }
          return console.log(res.error);
      })
      .catch(console.log);
  }

  render () {
    let projects = this.state.projects;
    return <div>
            <input type ="text" id="field"/>
            <button onClick={this.addProj}>Add project</button>
            <ol>
              {projects.map((el,i) => {
                return <li key={i} id={el._id} onClick={this.chooseProj}> {el.name} </li>;
              })}
            </ol>
          </div>
  }
}


class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return <div> 
            You are home! :)       
          </div>
  }
}
render((
  <Router history={browserHistory}>
    <Route path="/" component={StartPage}>
      <IndexRedirect to="/signup"/> 
      <Route path="/signup" component={Signup}/>
      <Route path="/login" component={Login}/>
      <Route path="/about" component={About}/>
    </Route>
    <Route path="app/:login" component={App}>
      <IndexRedirect to="home"/> 
      <Route path="home" component={Home}/>
      <Route path="projects" component={Projects}>
        <IndexRedirect to="list"/> 
        <Route path="list" component={ProjectsList}>
          <Route path=":projID" component={ProjectEditing}/>
        </Route>
        <Route path="new" component={ProjectsAddNew}/>
      </Route>
    </Route>
    <Route path="*" component={NotFound}/>
  </Router>
), document.getElementById('root'));