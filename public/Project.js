import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';

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
    let id = this.props.params.projectID;

    fetch(`/api/userdata/${login}/${id}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        this.setState({projectData: res});
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
            <h1> {this.state.projectData.name} </h1>
          </div>
  }
}

export default Project;