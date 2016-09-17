import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class Pish extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div id = "editingProject">
            I'm editing just now!
            {this.props.target.props.name}
          </div>
  }
}

class ProjectsItem extends React.Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.open = this.open.bind(this);
  }

  // overTheItem() {
  //   this.refs.editBtn.style.display = "flex";
  //   this.isOver = false;
  //   this.setState({editing: true});
  // }

  // leaveTheItem() {
  //   this.refs.editBtn.style.display = "none";
  //   this.setState({editing: false});
  // }

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
  edit() {
    this.props.onEdit(this.props.id); 
  }

  open() {
    // this.props.onOpen(this.props.id); 
    browserHistory.push(`/app/${this.props.login}/projects/p/${this.props.id}`); 
  }
  
  
  render () {
    let component = this.props.editing ? <Pish target = {this}/> : null;
    return <div>
            <div id = "projectsItem">
              <div id = "projectLine" onClick = {this.open}> 
                <div className = {this.props.label} id = "projectLabel"> 
                </div>
                {this.props.name}
              </div>
              <div> 
                <button ref = "editBtn" onClick = {this.edit}> Edit </button>
              </div>              
            </div>
            {component}
          </div>
  }
}

ProjectsItem.propTypes = {
  onDelete: React.PropTypes.func,
  onEdit: React.PropTypes.func,
  onOpen: React.PropTypes.func
};

export default ProjectsItem;
