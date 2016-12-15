import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';

export default class RewardsAddNew extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
    this.checkRepeated = this.checkRepeated.bind(this);
  }

  checkRepeated(e) {
    this.refs.cRep.className = (this.refs.cRep.className == "checked") ? 
      "unchecked" : "checked";
  }

  addNew(){
    let repeated = this.refs.cRep.className == "checked";
    let bodyJSON = JSON.stringify({
      name: this.refs.newRewardName.value,
      price: this.refs.newRewardPrice.value,
      repeated: repeated
    });

    let reqParams = {
      method: 'POST',
      headers: {  
        "Content-type": "application/json; charset=UTF-8"  
      },
      credentials: 'include',
      body: bodyJSON
    }
    let login = this.props.login;
    fetch(`/api/userdata/${login}/rewards`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        this.props.onNewRewardAdded(res.reward);
      })
      .catch(err => {
        console.log(err);
      })
  }

  render () {
    return<div className = "rewardsAddNew">
            <input type = "text" placeholder = "Name" 
              className = "newRewardName"
              ref = "newRewardName"
            />
            <input type = "number" defaultValue = "10" min = "5" 
              max = "500" 
              ref = "newRewardPrice"
              className = "newRewardPrice"
            />
            <div id = "checkBoxRepeated" className = "unchecked" ref = "cRep"
              onClick = {this.checkRepeated}>
              <i className="fa fa-repeat" aria-hidden="true"></i>
            </div>
            <button onClick = {this.addNew}> Add </button>
          </div>
  }
}

RewardsAddNew.propTypes = {
  onNewRewardAdded: React.PropTypes.func
}