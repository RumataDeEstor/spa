import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class ProjectsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isSelected: false, cName: 'unchecked'};
    this.select = this.select.bind(this);
  }

  select() {
    if (this.state.isSelected) {
      this.setState({isSelected: false, cName: 'unchecked'});
      return;
    } 
    this.setState({isSelected: true, cName: 'checked'});
    this.props.myFunc(this);
  }
  //TODO: crooked due to different price values
  render () {
    console.log(this.props);
    const cName = this.state.cName;
    return <div id = "projectsItem" className = {cName}>
            <div id = "customCheckbox" onClick = {this.select} className = {cName}>
            </div>
            <div id = "projectLine"> 
              <div className = {this.props.label} id = "projectLabel"> 
              </div>
              {this.props.name}
            </div>
            <div id = "points"> {this.props.points} </div>
          </div>
  }
}

ProjectsItem.propTypes = {
  myFunc: React.PropTypes.func,
};

export default ProjectsItem;
