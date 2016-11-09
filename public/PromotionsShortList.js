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
    this.handleChildDelete = this.handleChildDelete.bind(this);
  }

  componentDidMount(){
    ee.addListener('getPoints', this.getPoints);
    ee.addListener('promoDeleted', this.handleChildDelete)
    ee.emitEvent('reqForPoints');
    this.loadItems();
  }

  componentWillUnmount() {
    ee.removeListener('getPoints', this.getPoints);
    ee.removeListener('promoDeleted', this.handleChildDelete);
  }

  getPoints(points){
    this.setState({points: points});
  }

  handleChildDelete(id) {
    console.log(id);
    let newPromos = this.state.topPromos.slice();
    newPromos = newPromos.filter(el => el._id !== id);
    console.log(newPromos);
    this.setState({topPromos: newPromos});
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
    return <div id = "promoShort">
            <div id = "pshortTitle"> Top Promotions </div>
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
