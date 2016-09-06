import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ProjectsItem from './ProjectsItem'

class ProjectsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projects: []};
    this.loadProjects = this.loadProjects.bind(this);
  }

  loadProjects() {
    let reqParams = {
      method: 'GET',
      credentials: 'include'
    }

    fetch(`/api/userdata/${this.props.params.login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        res.projects.map(proj => {
          this.setState( {projects: [proj, ...this.state.projects] });
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    this.loadProjects();
  }

  handleChildDelete(id) {
    let newProjects = this.state.projects.slice();
    newProjects = newProjects.filter(el => el._id !== id);
    this.setState({projects: newProjects});
  }

  handleChildEdit(proj) {
    return <div> {proj.id} </div>
  }

  handleChildOpen(id) {
    let login = this.props.params.login;
    browserHistory.push(`/app/${login}/projects/p/${id}`); 
  }

  /*removing
    onRemovePerson: function(index) {
    var newData = this.state.data.slice(); //copy array
    newData.splice(index, 1); //remove element
    this.setState({data: newData}); //update state
  },*/

  render () {
    let projects = this.state.projects;
    return <div>
            List Page
            <div id = "projectsList">
              {projects.map((el,i) => {
                return <ProjectsItem key = {i} 
                id ={el._id} 
                onDelete={this.handleChildDelete.bind(this)} 
                onEdit={this.handleChildEdit.bind(this)}
                onOpen={this.handleChildOpen.bind(this)}
                points = {el.points} 
                name = {el.name} 
                label = {el.label}
                login = {this.props.params.login}/>
              })}       
            </div>
          </div>
  }
}

export default ProjectsList;
