import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ProjectEditing from './ProjectEditing';

class ProjectsItem extends React.Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.open = this.open.bind(this);
  }
  
  edit() {
    this.props.onEdit(this.props.id); 
  }

  open() {
    browserHistory.push(`/app/${this.props.login}/projects/p/${this.props.id}`); 
  }
  
  render () {
    let component = this.props.editing ? <ProjectEditing target = {this} login = {this.props.login}/> : null;
    return <div>
            <div id = "projectsItem">
              <div id = "projectLine" onClick = {this.open}> 
                <div className = {this.props.label} id = "projectLabel"> 
                </div>
                {this.props.name}
              </div>
              <div id = "editItem" className = {this.props.cNameEdit} onClick = {this.edit}>
                <i className="fa fa-pencil-square-o"></i>
              </div>             
            </div>
            {component}
          </div>
  }
}

ProjectsItem.propTypes = {
  onEdit: React.PropTypes.func
};

export default ProjectsItem;
