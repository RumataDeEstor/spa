import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class ProjectsItem extends React.Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.open = this.open.bind(this);
  }

  delete(){
    let reqParams = {
      method: 'DELETE',
      credentials: 'include'
    }

    let login = this.props.login;
    let projID = this.props.id;
    fetch(`/api/userdata/${login}/${projID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        this.props.onDelete(this.props.id); // tell to parent
      })
      .catch(err => {
        console.log(err);
      })
  }
  edit(){
    this.props.onEdit(this); 
  }

  open(){
    this.props.onOpen(this.props.id); 
  }
  
  
  render () {
    return <div id = "projectsItem">
            <div id = "projectLine" onClick = {this.open}> 
              <div className = {this.props.label} id = "projectLabel"> 
              </div>
              {this.props.name}
            </div>
            <div id = "points"> {this.props.points} </div>
            <div> 
              <button onClick = {this.delete}> Delete </button>
              <button onClick = {this.edit}> Edit </button>
            </div>
          </div>
  }
}

ProjectsItem.propTypes = {
  onDelete: React.PropTypes.func,
  onEdit: React.PropTypes.func,
  onOpen: React.PropTypes.func
};

export default ProjectsItem;
