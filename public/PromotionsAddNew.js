import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';

export default class PromotionsAddNew extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
    this.checkReuse = this.checkReuse.bind(this);
  }

  checkReuse(e) {
    e.target.className = (e.target.className == "checked") ? "unchecked" : "checked";
  }

  addNew(){
    let reusable = (checkBoxReuse.className == "checked") ? true : false;
    let bodyJSON = JSON.stringify({
      name: newPromoName.value,
      price: newPromoPrice.value,
      reusable: reusable
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
    fetch(`/api/userdata/${login}/promotions`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        this.props.onNewPromoAdded(res.promotion);
      })
      .catch(err => {
        console.log(err);
      })
  }

  render () {
    return<div id = "promotionsAddNew">
            <input type = "text" placeholder = "name" id = "newPromoName"/>
            <input type = "number" defaultValue = "10" min = "5" max = "500" id = "newPromoPrice"/>
            <div> reusable: 
              <div id = "checkBoxReuse" className = "unchecked" ref = "cReuse"
                onClick = {this.checkReuse}>
              </div>
            </div>
            <button onClick = {this.addNew}> Add </button>
          </div>
  }
}

PromotionsAddNew.propTypes = {
  onNewPromoAdded: React.PropTypes.func
}