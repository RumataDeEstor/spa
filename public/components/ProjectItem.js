import React from 'react'
import { render } from 'react-dom'
// import ProjectEditing from './ProjectEditing';

export default class ProjectItem extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render () {
    return <div className = "projectItem" ref = "item">
              <div className = "itemNormal" ref = "itemNorm">
                <div className = "projectLine"> 
                  <div style = {{backgroundColor: this.props.label}} 
                    className = "projectLabel"> 
                  </div>
                  <div className = "projName">{this.props.name}</div>                
                </div>
                <div id = "editItem" ref = "eBtn">
                  <i className="fa fa-pencil-square-o"></i>
                </div> 
              </div>  
            </div>          
  }
}

ProjectItem.propTypes = {
  // onEdit: React.PropTypes.func
  label: React.PropTypes.string,
  name: React.PropTypes.string
};
