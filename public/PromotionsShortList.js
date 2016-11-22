import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import PromotionItem from './PromotionItem';
import ee from './EventEmitter';
// forms everywhere;
// true Points here
// can I edit through Short List?
export default class PromotionsShortList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {topPromos: [], points: null};
    this.loadItems = this.loadItems.bind(this);
    this.getPoints = this.getPoints.bind(this);
  }

  componentDidMount(){
    ee.addListener('getPoints', this.getPoints);
    ee.emitEvent('reqForPoints');
    this.loadItems();
  }

  componentWillUnmount() {
    ee.removeListener('getPoints', this.getPoints);
  }

  getPoints(points){
    this.setState({points: points});
  }

  loadItems(){
    let reqParams = {
      method: 'GET',
      credentials: 'include'
    }
    
    let login = this.props.login;
    fetch(`/api/userdata/${login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        let newTopPromos = res.user.promotions
          .sort((first, second) => {
            if (first.price > second.price) return -1;
            return 1;
          }).slice(0, 3);
        this.setState({topPromos: newTopPromos});
        return;
      })
      .catch(err => {
        console.log(err);
      })
  }

  // //todo: DidMount - fetch to check Auth; if not user page, forbidden, redirect.
  render () {
    return <div className = "promoShort">
            <div className = "pshortTitle"> Top Promotions </div>
              {this.state.topPromos.map((el, i) => {
                return <PromotionItem
                  key = {i} 
                  id ={el._id} 
                  name = {el.name} 
                  price = {el.price} 
                  points = {this.state.points}
                  login = {this.props.login}
                  loc = "short"
                />
              })
            } 
          </div>
  }
}
