import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import PromoModal from './PromoModal';

export default class PromotionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name, 
      price: this.props.price,
      points: this.props.points,
      id: this.props.id,
      percentsValue: 0,
      loc: this.props.loc,
      modal: false
    };

    this.showEditName = this.showEditName.bind(this);
    this.hideEditName = this.hideEditName.bind(this);
    this.hideEditPrice = this.hideEditPrice.bind(this);
    this.showEditPrice = this.showEditPrice.bind(this);
    this.submitName = this.submitName.bind(this); // rename 
    this.submitPrice = this.submitPrice.bind(this); // rename validate?
    this.submitData = this.submitData.bind(this);
    this.showPercents = this.showPercents.bind(this);
    this.hidePercents = this.hidePercents.bind(this);
    this.showModal = this.showModal.bind(this);
  }
  // almost the same as while mounting; may be separated;
  componentWillReceiveProps(newProps){
    this.setState({points: newProps.points});
    let value = Math.round( newProps.points / newProps.price * 100 );
    value = (value > 100) ? 100 : value;
    this.setState({percentsValue: value}); 
    const fullHeight = 74;
    let newHeight = fullHeight * this.state.percentsValue / 100;    
    this.refs.lvl.style.height = `${newHeight}px`;   
  }

  componentWillMount() {
    let value = Math.round( this.state.points / this.state.price * 100 );
    value = (value > 100) ? 100 : value;
    this.setState({percentsValue: value});    
  }

  componentDidMount() {
    if (this.state.loc == "full") {
      this.refs.promoPrice.addEventListener('click', this.showEditPrice);
      this.refs.promoName.addEventListener('click', this.showEditName)
    } 
    this.refs.editPromoName.addEventListener('submit',this.submitName, false);
    this.refs.editPromoPrice.addEventListener('submit',this.submitPrice, false);
    const fullHeight = 74;
    let newHeight = fullHeight * this.state.percentsValue / 100;    
    this.refs.lvl.style.height = `${newHeight}px`;
  } 

  showModal () {
    console.log('show');
    this.setState({modal: true});
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

  showPercents() {
    this.refs.pers.style.visibility = "visible";
  }

  hidePercents() {
    this.refs.pers.style.visibility = "hidden";
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
    this.refs.promoPrice.style.display = "none";
  }

  render () {
    let modal = (this.state.modal) ? <PromoModal/> : null;
    return<div id = "promotionItem">

            <div id = "promoPrice" ref = "promoPrice">
              {this.state.price}
              <i className="fa fa-circle" aria-hidden="true"></i>
            </div>

            <form ref = "editPromoPrice" id = "editPromoPrice">
              <input type = "number" min = "5" max = "500" name = "fieldPrice"/>
            </form>      
            
            <div id = "exCircle" 
              onMouseOver = {this.showPercents}
              onMouseOut = {this.hidePercents}
              onClick = {this.showModal}>
              {modal}
              <div id = "inCircle">
                <div id = "square" ref = "lvl">         
                </div>     
              </div>
            </div>
            <div id = "percents" ref = "pers"> 
              {`${this.state.percentsValue}%`}
            </div>
            <div id = "promoName" ref = "promoName">
              {this.state.name}
            </div>
            <form ref = "editPromoName" id = "editPromoName">
              <input type = "text" name = "fieldName"/>
            </form>
          </div>
  }
}
