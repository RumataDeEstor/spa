import React from 'react'
import { render } from 'react-dom'
import ProjectAddNew from './ProjectAddNew'
import ProjectItem from './ProjectItem'

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render () {
    return <div className = "projListPage"> 
            <div className = "listTitle">Projects</div>
            <div className = "annotation"> 
              {`Click on any project to see its tasks. 
                You can choose name and label (color) for your project.`}
            </div>
            <ProjectsAddNew 
              login = "TESTLOGIN"
              
            />
            <div className = "projectsList">
              {
                this.props.projects.map((el,i,arr) => {
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

/*<ProjectsAddNew 
              login = {this.props.params.login}
              onAddingNew = {this.handleAddingNew.bind(this)}
            />    */  