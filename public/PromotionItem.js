import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';

class PromotionItem extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {percentsValue: 0};
    this.showEditName = this.showEditName.bind(this);
    this.pishSubmit = this.pishSubmit.bind(this);
  }

  componentWillMount() {
    console.log('will mount')
    
    // console.log(`
    //   key: ${this.props.key}
    //   points:${this.props.points}
    //   price:${this.props.price}
    //   value:${value}
    //   `);
    
  }
  pishSubmit (e){
    e.preventDefault();
    console.log('pish submit!');
  }

  componentDidMount() {
    // this.refs.editPromoName.onsubmit = () => {
    //   console.log('submit!');
    // }
    this.refs.editPromoName.addEventListener('submit',this.pishSubmit, false);
    console.log('did mount');
    let value = Math.round( this.props.points / this.props.price * 100 );
    value = (value > 100) ? 100 : value;
    // this.setState({percentsValue: value});

    const fullHeight = 74;
    // let newHeight = fullHeight * this.state.percentsValue / 100;
    let newHeight = fullHeight * value / 100;
    this.refs.lvl.style.height = `${newHeight}px`;
    this.refs.pers.innerHTML = value; 

    // make it clean; state? Appropriate percents; z-index with percents;
  } 

  showEditName(e) {
    this.refs.editPromoName.style.display = "flex";
    e.target.style.display = "none";
  }

  render () {
    return<div id = "promotionItem">            
            <div id = "exCircle">
              <div id = "inCircle">
                <div id = "percents" ref = "pers"> {
                  // `${this.state.percentsValue}%`
                }
                 </div>
                <div id = "square" ref = "lvl">         
                </div>     
              </div>
            </div>
            <div onClick = {this.showEditName}>{this.props.name}</div>
            <form ref = "editPromoName" id = "editPromoName">
              <input type = "text"/>
            </form>
            <div>{this.props.price}</div>  
            <div>{this.props.points}</div>           
          </div>
  }
}

export default PromotionItem;
