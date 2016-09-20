import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import PromotionItem from './PromotionItem';
import PromotionsAddNew from './PromotionsAddNew';

class Promotions extends React.Component {
  constructor(props) {
    super(props);
    this.loadItems = this.loadItems.bind(this);
    this.state = {promotions: []};
  }
  // //todo: DidMount - fetch to check Auth; if not user page, forbidden, redirect.
  
  componentDidMount(){
    this.loadItems();
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
            <PromotionsAddNew login = {this.props.params.login}/>
            HERE IS YOUR PROMOTIONS
            {
              this.state.promotions.map((el,i) => {
                return <PromotionItem
                  key = {i} 
                  id ={el._id} 
                  name = {el.name} 
                  price = {el.price} 
                />
              })
            }
          </div>
  }
}

export default Promotions;
