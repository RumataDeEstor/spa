import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import ee from './EventEmitter'

export default class RewardItem extends React.Component {
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
    this.deleteReward = this.deleteReward.bind(this);
    this.getReward = this.getReward.bind(this);
    this.tempUpdPoints = this.tempUpdPoints.bind(this);
    this.submitIsRepeated = this.submitIsRepeated.bind(this);
    this.checkName = this.checkName.bind(this);
    this.trimName = this.trimName.bind(this);
    this.normalizePoints = this.normalizePoints.bind(this);
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
      this.refs.rewardPrice.addEventListener('click', this.showEditPrice);
      this.refs.rewardNameContainer.addEventListener('click', this.showEditName)
      this.refs.del.style.display = "flex";
    } 
    this.refs.editRewardName.addEventListener('submit',this.submitName, false);
    this.refs.editRewardPrice.addEventListener('submit',this.submitPrice, false);
    const fullHeight = 74;
    let newHeight = fullHeight * this.state.percentsValue / 100;    
    this.refs.lvl.style.height = `${newHeight}px`;
  } 

  getReward () {   
    this.tempUpdPoints();
    if (!this.state.repeated) {
      this.deleteReward();
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

  deleteReward(){
    // this.refs.msg.innerText = "*deleted*";
    let reqParams = {
      method: 'DELETE',
      credentials: 'include'
    }

    let login = this.props.login;
    let id = this.props.id;

    fetch(`/api/userdata/${login}/rewards/${id}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        this.refs.item.style.display = "none";
        // this.onFinishEdit().then(res => ee.emitEvent('taskDeleted', [taskID]));        
        // ee.emitEvent('rewardDeleted', [id]);  
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
    let rewardID = this.props.id;

    fetch(`/api/userdata/${login}/rewards/${rewardID}`, reqParams)
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
    this.trimName();
    let newName = e.target.fieldName.value;
    if ( !this.checkName() ) return;
    this.setState({name: newName});
    this.submitData({name: newName});
    this.hideEditName();
  }

  checkName () {
    let name = this.refs.editName.value;
    return (/^(\w|\s|[А-Яа-яёЁ])*$/.test(name));   
  }

  trimName () {
    this.refs.editName.value = this.refs.editName.value.trim();
    let validName = (this.refs.editName.value.length > 30) ? 
      this.refs.editName.value.slice(0, 30) : this.refs.editName.value;
    this.refs.editName.value = validName;
  }

  normalizePoints () {
    let points = this.refs.editPrice.value;
    let newPoints = this.refs.editPrice.defaultValue;
    this.refs.editPrice.value = ( (points > 4) && 
      (points < 5001) ) ? points : newPoints;  
  }

  submitPrice (e) {
    e.preventDefault();
    this.normalizePoints();
    let newPrice = e.target.fieldPrice.value; 
    this.setState({price: newPrice}); 
    this.submitData({price: newPrice});
    this.hideEditPrice();
  }

  submitIsRepeated(){
    if (this.props.loc == "short") return; // remove handler at all?
    this.refs.rep.className = (this.refs.rep.className == "checked") ? 
      "unchecked" : "checked";
    let repeated = (this.refs.rep.className == "checked");
    this.setState({repeated: repeated});
    this.submitData({repeated: repeated});
  }

  hideEditName(){
    this.refs.editRewardName.style.display = "none";
    this.refs.rewardNameContainer.style.display = "flex";
  }

  showEditName() {
    this.hideEditPrice();
    this.refs.editRewardName.style.display = "flex";
    this.refs.rewardNameContainer.style.display = "none";
  }

  hideEditPrice () {
    this.refs.editRewardPrice.style.display = "none";
    this.refs.rewardPrice.style.display = "flex";
  }

  showEditPrice(e) {
    this.hideEditName();
    this.refs.editRewardPrice.style.display = "flex";
    this.refs.rewardPrice.style.display = "none";
  }

  render () {
    let isRepeated = (this.state.repeated) ? 
      "checked" : "unchecked";
    return<div ref = "item" className = "rewardItem"> 
            <div id = "repeatMark"
              ref = "rep" 
              className = {isRepeated}
              onClick = {this.submitIsRepeated}
            >
              <i className="fa fa-repeat" aria-hidden="true"></i>
            </div>        
            <div className = "rewardPrice" ref = "rewardPrice">
              {this.state.price}
            </div>
            <button className = "rewardDelete" ref = "del" 
              onClick = {this.deleteReward}
            >
              <i className="fa fa-trash"></i>
            </button>     
            <form ref = "editRewardPrice" className = "editRewardPrice">
              <input type = "number" 
                ref = "editPrice"
                className = "rewardPriceEdit"
                min = "5" max = "5000" 
                name = "fieldPrice"
                defaultValue = {this.state.price}/>
            </form>  
            <div className = "exCircle" 
              onMouseOver = {this.showMore}
              onMouseOut = {this.hideMore}
            >
              <div className = "getRewardWindow" ref = "getPWindow" 
                onClick = {this.getReward}>
                <i className ="fa fa-check" aria-hidden="true"></i>
              </div>
              <div className = "inCircle">
                <div className = "square" ref = "lvl">         
                </div>     
              </div>
            </div>
            <div className = "percents" ref = "pers"> 
              {`${this.state.percentsValue}%`}
            </div>
            <div ref = "rewardNameContainer" className = "rewardNameContainer">
              <div className = "rewardName">
                {this.state.name}
              </div>
            </div>
            <form ref = "editRewardName" className = "editRewardName">
              <input type = "text" className = "rewardNameEdit" 
                ref = "editName"
                name = "fieldName" 
                defaultValue = {this.state.name}
                maxLength = "30"
              /> 
            </form>
          </div>
  }
}
