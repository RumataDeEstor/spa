import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import PromotionItem from './PromotionItem';
import PromotionsAddNew from './PromotionsAddNew';
import Points from './Points';
import ee from './EventEmitter';

export default class Promotions extends React.Component {
  constructor(props) {
    super(props);
    this.loadItems = this.loadItems.bind(this);
    this.state = {promotions: [], points: null};
    this.getPoints = this.getPoints.bind(this);
    this.handleChildDelete = this.handleChildDelete.bind(this);
  }
  // //todo: DidMount - fetch to check Auth; if not user page, forbidden, redirect.
  
  componentDidMount(){
    ee.addListener('getPoints', this.getPoints);
    ee.addListener('promoDeleted', this.handleChildDelete);
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
    let newPromos = this.state.promotions.slice();
    newPromos = newPromos.filter(el => el._id !== id);
    this.setState({promotions: newPromos});
  }

  handleNewPromoAdding(promo) {
    this.setState({promotions: [promo, ...this.state.promotions] });
  }

  loadItems(){
    let reqParams = {
      method: 'GET',
      credentials: 'include'
    }
    let login = this.props.params.login;
    fetch(`/api/userdata/${login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        let newPromos = res.user.promotions.reverse();
        this.setState({promotions: newPromos});
      })
      .catch(err => {
        console.log(err);
      })
  }

  render () {
    return <div id = "promotions">
            <Points login = {this.props.params.login} ref = "foo"/>
            <PromotionsAddNew login = {this.props.params.login}
              onNewPromoAdded = {this.handleNewPromoAdding.bind(this)}
            />
            <div id = "promoList">
              {
                this.state.promotions.map((el,i,arr) => {
                  return <PromotionItem
                    key = {arr.length - i - 1} 
                    id ={el._id} 
                    name = {el.name} 
                    price = {el.price} 
                    repeated = {el.repeated}
                    points = {this.state.points}
                    login = {this.props.params.login}
                    loc = "full"
                  />
                })
              }
            </div>
          </div>
  }
}