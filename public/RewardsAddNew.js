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
    this.checkForm = this.checkForm.bind(this);
    this.checkName = this.checkName.bind(this);
    this.trimName = this.trimName.bind(this);
    this.clearFields = this.clearFields.bind(this);
  }

  componentDidMount () {
    this.refs.rewardsAddNewForm.addEventListener('submit', this.checkForm, false);
  }

  checkForm (e) {
    e.preventDefault();
    this.trimName();
    this.normalizePoints();
    if ( this.checkName() ) this.addNew();
  }

  trimName () {
    this.refs.newRewardName.value = this.refs.newRewardName.value.trim();
    let validName = (this.refs.newRewardName.value.length > 30) ? 
      this.refs.newRewardName.value.slice(0, 30) : this.refs.newRewardName.value;
    this.refs.newRewardName.value = validName;
  }

  normalizePoints () {
    let points = this.refs.newRewardPrice.value;
    let newPoints = this.refs.newRewardPrice.defaultValue;
    this.refs.newRewardPrice.value = ( (points > 4) && 
      (points < 5001) ) ? points : newPoints;  
  }

  checkName () {
    let name = this.refs.newRewardName.value;
    return (/^(\w|\s|[А-Яа-яёЁ])*$/.test(name));   
  }

  checkRepeated(e) {
    this.refs.cRep.className = (this.refs.cRep.className == "checked") ? 
      "unchecked" : "checked";
  }

  clearFields () {
    this.refs.newRewardName.value = "";
    this.refs.newRewardPrice.value = this.refs.newRewardPrice.defaultValue;
    this.refs.cRep.className = "unchecked";
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
        this.clearFields();
        this.props.onNewRewardAdded(res.reward);
      })
      .catch(err => {
        console.log(err);
      })
  }

  render () {
    return<div className = "rewardsAddNew">
            <form ref = "rewardsAddNewForm" className = "rewardsAdd">
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
                onClick = {this.checkRepeated}>
                <i className="fa fa-repeat" aria-hidden="true"></i>
              </div>
              <input type = "submit" className = "add" value = "Add"/>
            </form>
          </div>
  }
} 

RewardsAddNew.propTypes = {
  onNewRewardAdded: React.PropTypes.func
}