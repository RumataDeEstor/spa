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
    this.getData = this.getData.bind(this);
  }

  loadProjects() {
    ee.emitEvent("reqForUserdata");
  }

  getData (data) {
    let newProjects = data.projects.slice();
    newProjects = newProjects.reverse();
    this.setState({projects: newProjects});
  }

  componentDidMount() {
    ee.addListener('projectFinishEdit', this.finishChildEditing);
    ee.addListener('projectSaveEdit', this.updateChild);
    ee.addListener('giveData', this.getData);
    this.loadProjects();
  }

  componentWillUnmount() { 
    ee.removeListener('projectFinishEdit', this.finishChildEditing);
    ee.removeListener('projectSaveEdit', this.updateChild);
    ee.removeListener('giveData', this.getData);
  }

  handleAddingNew(proj){
    this.setState({projects: [proj, ...this.state.projects] });
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
            <div className = "listTitle">Projects</div>
            <div className = "annotation"> 
              {`Click on any project to see its tasks. 
                You can choose name and label (color) for your project.`}
            </div>
            <ProjectsAddNew 
              login = {this.props.params.login}
              onAddingNew = {this.handleAddingNew.bind(this)}
            />
            <div className = "projectsList">
              {
                this.state.projects.map((el,i,arr) => {
                  let editing = (this.state.isEditing == el._id);
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
            