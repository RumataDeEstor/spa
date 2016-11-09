import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import ee from './EventEmitter'

export default class PromotionItem extends React.Component {
  // !!! TODO: hot deleting; 
  // mb changing Reuse
  // !!! hot level changing after editing Points
  // common method for points updating - here and in Tasks
  // in top - user choice
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name, 
      price: this.props.price,
      points: this.props.points,
      repeated: this.props.repeated,
      percentsValue: 0,
      modal: false,
      unlocked: false
    };

    this.showEditName = this.showEditName.bind(this);
    this.hideEditName = this.hideEditName.bind(this);
    this.hideEditPrice = this.hideEditPrice.bind(this);
    this.showEditPrice = this.showEditPrice.bind(this);
    this.submitName = this.submitName.bind(this); // rename 
    this.submitPrice = this.submitPrice.bind(this); // rename validate?
    this.submitData = this.submitData.bind(this);
    this.showMore = this.showMore.bind(this);
    this.hideMore = this.hideMore.bind(this);
    this.deletePromo = this.deletePromo.bind(this);
    this.getPromo = this.getPromo.bind(this);
    this.tempUpdPoints = this.tempUpdPoints.bind(this);
    this.submitIsRepeated = this.submitIsRepeated.bind(this);
  }
  // almost the same as while mounting; may be separated;
  componentWillReceiveProps(newProps){
    this.setState({points: newProps.points});
    let value = Math.round( newProps.points / newProps.price * 100 );
    value = (value > 100) ? 100 : value;
    this.setState({percentsValue: value}); 
    if (value == 100) {
      this.setState({unlocked: true});
    } else {
      this.setState({unlocked: false});
    }
    const fullHeight = 74;
    let newHeight = fullHeight * value / 100;  
    console.log(newHeight);
    this.refs.lvl.style.height = `${newHeight}px`; 
    this.refs.lvl.style.WebkitAnimationName = "pish";
  }

  componentWillMount() {
    let value = Math.round( this.state.points / this.state.price * 100 );
    value = (value > 100) ? 100 : value;
    this.setState({percentsValue: value});   
    if (value == 100) {
      this.setState({unlocked: true});
    } else {
      this.setState({unlocked: false});
    }
  }

  componentDidMount() {
    if (this.props.loc == "full") {
      this.refs.promoPrice.addEventListener('click', this.showEditPrice);
      this.refs.promoName.addEventListener('click', this.showEditName)
      this.refs.del.style.display = "flex";
    } 
    this.refs.editPromoName.addEventListener('submit',this.submitName, false);
    this.refs.editPromoPrice.addEventListener('submit',this.submitPrice, false);
    const fullHeight = 74;
    let newHeight = fullHeight * this.state.percentsValue / 100;    
    this.refs.lvl.style.height = `${newHeight}px`;
  } 

  getPromo () {   
    this.tempUpdPoints();
    if (!this.state.repeated) {
      this.deletePromo();
    }
  }

  //rewrite; also in tasks
  tempUpdPoints(){
    let bodyJSON = JSON.stringify({
      points: -this.state.price
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

    fetch(`/api/userdata/${login}/points`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        ee.emitEvent('pointsUpdated', [-this.state.price]);
      })
      .catch(err => {
        console.log(err);
      }) 
  }

  showMore() {
    this.refs.pers.style.visibility = "visible";
    if (this.state.unlocked) {
      this.refs.getPWindow.style.display = "flex";
    }    
  }

  hideMore() {
    this.refs.pers.style.visibility = "hidden";
    this.refs.getPWindow.style.display = "none";
  }

  deletePromo(){
    // this.refs.msg.innerText = "*deleted*";
    let reqParams = {
      method: 'DELETE',
      credentials: 'include'
    }

    let login = this.props.login;
    let id = this.props.id;

    fetch(`/api/userdata/${login}/promotions/${id}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        this.refs.item.style.display = "none";
        // this.onFinishEdit().then(res => ee.emitEvent('taskDeleted', [taskID]));        
        // ee.emitEvent('promoDeleted', [id]);  
      })
      .catch(err => {
        console.log(err);
      })
  }  

  submitData(data){
    console.log('submitData');
    let repeated = (data.repeated !== undefined) ? data.repeated : null;
    let bodyJSON = JSON.stringify({
      name: data.name || null,
      price: data.price || null,
      repeated: repeated
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
    let promoID = this.props.id;

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
    this.setState({name: newName});
    this.submitData({name: newName});
    this.hideEditName();
  }

  submitPrice (e) {
    e.preventDefault();
    //AJAX
    let newPrice = e.target.fieldPrice.value; // e?
    this.setState({price: newPrice}); 
    this.submitData({price: newPrice});
    this.hideEditPrice();
  }

  submitIsRepeated(){
    if (this.props.loc == "short") return; // remove handler at all?
    this.refs.rep.className = (this.refs.rep.className == "checked") ? 
      "unchecked" : "checked";
    console.log(this.refs.rep.className);
    let repeated = (this.refs.rep.className == "checked");
    console.log(repeated);
    this.setState({repeated: repeated});
    this.submitData({repeated: repeated});
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
    let isRepeated = (this.state.repeated) ? 
      "checked" : "unchecked";
    return<div ref = "item" id = "promotionItem"> 
            <div id = "repeatMark"
              ref = "rep" 
              className = {isRepeated}
              onClick = {this.submitIsRepeated}
            >
              <i className="fa fa-repeat" aria-hidden="true"></i>
            </div>        
            <div id = "promoPrice" ref = "promoPrice">
              {this.state.price}
            </div>
            <button id = "promoDelete" ref = "del" onClick = {this.deletePromo}>
              <i className="fa fa-trash"></i>
            </button>     
            <form ref = "editPromoPrice" id = "editPromoPrice">
              <input type = "number" min = "5" max = "500" 
              name = "fieldPrice"
              defaultValue = {this.state.price}/>
            </form>      
            
            <div id = "exCircle" 
              onMouseOver = {this.showMore}
              onMouseOut = {this.hideMore}
            >
              <div id = "getPromoWindow" ref = "getPWindow" 
                onClick = {this.getPromo}>
                <i className ="fa fa-check" aria-hidden="true"></i>
              </div>
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
              <input type = "text" name = "fieldName" 
                defaultValue = {this.state.name}/>
            </form>
          </div>
  }
}
