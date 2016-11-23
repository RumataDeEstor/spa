import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ProjectsAddNew from './ProjectsAddNew'
import ProjectsItem from './ProjectsItem'
import ee from './EventEmitter';

export default class ProjectsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: [], isEditing: null };
    this.loadProjects = this.loadProjects.bind(this);
    this.finishChildEditing = this.finishChildEditing.bind(this);
    this.updateChild = this.updateChild.bind(this);
    this.handleChildDelete = this.handleChildDelete.bind(this);    
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
        let newProjects = res.user.projects.reverse();
        this.setState({projects: newProjects});
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    ee.addListener('projectFinishEdit', this.finishChildEditing);
    ee.addListener('projectSaveEdit', this.updateChild);
    ee.addListener('projectDeleted', this.handleChildDelete);
    this.loadProjects();
  }

  componentWillUnmount() { 
    ee.removeListener('projectFinishEdit', this.finishChildEditing);
    ee.removeListener('projectSaveEdit', this.updateChild);
    ee.removeListener('projectDeleted', this.handleChildDelete);
  }

  handleAddingNew(proj){
    this.setState({projects: [proj, ...this.state.projects] });
  }

  handleChildDelete(id) {
    let newProjects = this.state.projects.slice();
    newProjects = newProjects.filter(el => el._id !== id);
    this.setState({projects: newProjects});
  }

  handleChildEdit(id) {
    this.setState({isEditing: id});
  }

  updateChild(itemID, newData) {
    this.state.projects.map(el => {
      if (el._id == itemID) {
        el.name = newData.name;
        el.label = newData.label;
      }
      return el;
    });
  }

  finishChildEditing() {
    this.setState({isEditing: null});
  }
  
  render () {
    return <div className = "projListPage"> 
            <div className = "pListTitle">Projects</div>
            Click on any project to see its tasks.
            <ProjectsAddNew 
              login = {this.props.params.login}
              onAddingNew = {this.handleAddingNew.bind(this)}
            />
            <div className = "projectsList">
              {
                this.state.projects.map((el,i,arr) => {
                  let editing = (this.state.isEditing == el._id) ? true : false;
                  let cNameEdit = (editing) ? "editing" : "";
                  return <ProjectsItem key = {arr.length - i - 1} 
                    id ={el._id} 
                    name = {el.name} 
                    label = {el.label}
                    login = {this.props.params.login}
                    editing = {editing}
                    cNameEdit = {cNameEdit}
                    onEdit={this.handleChildEdit.bind(this)}
                  />
                })
              }       
            </div>
          </div>
  }
}
            