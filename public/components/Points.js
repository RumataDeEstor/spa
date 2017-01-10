import React from 'react';
import { render } from 'react-dom';

export default class Points extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return<div className = "userPoints" ref = "points">
            <div className = "pointsContainer" ref = "pContainer">
              <div className = "changePointsSmall" ref = "small"></div>
              {this.props.points}              
            </div>
          </div>
  }
}

InternalTopmenu.propTypes = {
  login: React.PropTypes.string,
  points: React.PropTypes.number
};
