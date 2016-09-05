import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ProjectsItem from './ProjectsItem'
import ProjectsListMenu from './ProjectsListMenu'

class ProjectsList extends React.Component {
  constructor(props) {
    super(props);
    // this.handleChildFunc = this.handleChildFunc.bind(this);
    // this.state = {selected: []};
    this.state = {projects: [], selected: []};
    this.loadProjects = this.loadProjects.bind(this);
  }

  loadProjects() {
    console.log(this.props.routes);
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

  handleChildFunc(item) {
    this.setState({selected: [...this.state.selected, {name: item.props.name}]});
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
            <ProjectsListMenu login = {this.props.params.login} selected = {this.state.selected}/>
            List Page
            <div id = "projectsList">
              {projects.map((el,i) => {
                return <ProjectsItem key = {i} 
                id ={el._id} 
                myFunc={this.handleChildFunc.bind(this)} 
                points = {el.points} 
                name = {el.name} 
                label = {el.label}/>
              })}       
            </div>
          </div>
  }
}

export default ProjectsList;
