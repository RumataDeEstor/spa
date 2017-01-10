import React from 'react';
import { render } from 'react-dom';

export default class RewardAddNew extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return<div className = "rewardAddNew">
            <form ref = "rewardAddNewForm" className = "rewardAdd">
              <input type = "text" placeholder = "Name" 
                className = "newRewardName"
                ref = "newRewardName"
                maxLength = "30"
              />
              <input type = "number" defaultValue = "10" 
                min = "5" 
                max = "5000" 
                ref = "newRewardPrice"
                className = "newRewardPrice"
              />
              <div id = "checkBoxRepeated" className = "unchecked" ref = "cRep"
                
              >
                <i className="fa fa-repeat" aria-hidden="true"></i>
              </div>
              <input type = "submit" className = "add" value = "Add"/>
            </form>
          </div>
  }
} 

// RewardAddNew.propTypes = {
//   onNewRewardAdded: React.PropTypes.func
// }