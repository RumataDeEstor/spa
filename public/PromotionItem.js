import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';

export default class PromotionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name, 
      price: this.props.price,
      points: this.props.points,
      id: this.props.id,
      percentsValue: 0
    };

    this.showEditName = this.showEditName.bind(this);
    this.hideEditName = this.hideEditName.bind(this);
    this.hideEditPrice = this.hideEditPrice.bind(this);
    this.showEditPrice = this.showEditPrice.bind(this);
    this.submitName = this.submitName.bind(this); // rename 
    this.submitPrice = this.submitPrice.bind(this); // rename validate?
    this.submitData = this.submitData.bind(this);
  }

  componentWillMount() {
    let value = Math.round( this.props.points / this.props.price * 100 );
    value = (value > 100) ? 100 : value;
    this.setState({percentsValue: value});    
  }

  submitData(data){
    console.log('submitData');
    let bodyJSON = JSON.stringify({
      name: data.name || null,
      price: data.price || null
    });
      
    let reqParams = {
      method: 'PUT',
      headers: {  
        "Content-type": "application/json; charset=UTF-8"  
      },
      credentials: 'include',
      body: bodyJSON
    }

    let login = this.props.login;
    let promoID = this.state.id;

    fetch(`/api/userdata/${login}/promotions/${promoID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        console.log(res);
        // let newData = {name: editName.value, label: editChosenColor.className};
        //take from server?
        // ee.emitEvent('projectSaveEdit', [projID, newData]);
        // this.onFinishEdit();
      })
      .catch(err => {
        console.log(err);
      })
  }

  submitName (e){
    e.preventDefault();
    console.log('submit Name')
    //AJAX
    let newName = e.target.fieldName.value;
    this.setState({name: newName}); // update from server, not here.
    this.submitData({name: newName});
    this.hideEditName();
  }

  submitPrice (e) {
    e.preventDefault();
    //AJAX
    let newPrice = e.target.fieldPrice.value;
    this.setState({price: newPrice}); // update from server, not here.
    this.submitData({price: newPrice});
    this.hideEditPrice();
  }

  componentDidMount() {
    this.refs.editPromoName.addEventListener('submit',this.submitName, false);
    this.refs.editPromoPrice.addEventListener('submit',this.submitPrice, false);
    const fullHeight = 74;
    let newHeight = fullHeight * this.state.percentsValue / 100;    
    this.refs.lvl.style.height = `${newHeight}px`;
  } 

  hideEditName(){
    this.refs.editPromoName.style.display = "none";
    this.refs.promoName.style.display = "flex";
  }

  showEditName(e) {
    this.hideEditPrice();
    this.refs.editPromoName.style.display = "flex";
    e.target.style.display = "none";
  }

  hideEditPrice () {
    this.refs.editPromoPrice.style.display = "none";
    this.refs.promoPrice.style.display = "flex";
  }

  showEditPrice(e) {
    this.hideEditName();
    this.refs.editPromoPrice.style.display = "flex";
    e.target.style.display = "none";
  }

  render () {
    return<div id = "promotionItem">            
            <div id = "exCircle">
              <div id = "inCircle">
                <div id = "percents" ref = "pers"> {
                  `${this.state.percentsValue}%`
                }
                 </div>
                <div id = "square" ref = "lvl">         
                </div>     
              </div>
            </div>
            <div id = "promoName" ref = "promoName" onClick = {this.showEditName}>
              {this.state.name}
            </div>
            <form ref = "editPromoName" id = "editPromoName">
              <input type = "text" name = "fieldName"/>
            </form>
            <div id = "promoPrice" ref = "promoPrice" onClick = {this.showEditPrice}>
              {this.state.price}
            </div>
            <form ref = "editPromoPrice" id = "editPromoPrice">
              <input type = "number" min = "5" max = "500" name = "fieldPrice"/>
            </form>         
          </div>
  }
}
