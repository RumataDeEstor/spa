import React from 'react';
import { render } from 'react-dom';

export default class RewardItem extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render () {
    let isRepeated = (this.props.repeated) ? 
      "checked" : "unchecked";
    return<div ref = "item" className = "rewardItem"> 
            <div id = "repeatMark"
              ref = "rep" 
              className = {isRepeated}
            >
              <i className="fa fa-repeat" aria-hidden="true"></i>
            </div>        
            <div className = "rewardPrice" ref = "rewardPrice">
              {this.props.price}
            </div>
            <button className = "rewardDelete" ref = "del" 

            >
              <i className="fa fa-trash"></i>
            </button>     
            <form ref = "editRewardPrice" className = "editRewardPrice">
              <input type = "number" 
                ref = "editPrice"
                className = "rewardPriceEdit"
                min = "5" max = "5000" 
                name = "fieldPrice"
                defaultValue = {this.props.price}/>
            </form>  
            <div className = "exCircle" 
             
            >
              <div className = "getRewardWindow" ref = "getRWindow" 
              
              >
                <i className ="fa fa-check" aria-hidden="true"></i>
              </div>
              <div className = "inCircle">
                <div className = "square" ref = "lvl">         
                </div>     
              </div>
            </div>
            <div className = "percents" ref = "pers"> 
              {`${this.props.percentsValue}%`}
            </div>
            <div ref = "rewardNameContainer" className = "rewardNameContainer">
              <div className = "rewardName">
                {this.props.name}
              </div>
            </div>
            <form ref = "editRewardName" className = "editRewardName">
              <input type = "text" className = "rewardNameEdit" 
                ref = "editName"
                name = "fieldName" 
                defaultValue = {this.props.name}
                maxLength = "30"
              /> 
            </form>
          </div>
  }
}

RewardItem.propTypes = {
  // onEdit: React.PropTypes.func
  label: React.PropTypes.string,
  name: React.PropTypes.string,
  percentsValue: React.PropTypes.number,
  price: React.PropTypes.number,
  repeated: React.PropTypes.bool 
};

