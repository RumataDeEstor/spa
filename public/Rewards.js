import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import RewardItem from './RewardItem';
import RewardsAddNew from './RewardsAddNew';
import Points from './Points';
import ee from './EventEmitter';

export default class Rewards extends React.Component {
  constructor(props) {
    super(props);
    this.loadItems = this.loadItems.bind(this);
    this.state = {rewards: [], points: null};
    this.getPoints = this.getPoints.bind(this);
    // this.updateChild = this.updateChild.bind(this);
    this.handleChildDelete = this.handleChildDelete.bind(this);
  }
  // //todo: DidMount - fetch to check Auth; if not user page, forbidden, redirect.
  
  componentDidMount(){
    ee.addListener('getPoints', this.getPoints);
    ee.addListener('rewardDeleted', this.handleChildDelete);
    // ee.addListener('rewardEdited', this.updateChild);
    this.loadItems();
  }

  componentWillUnmount() {
    ee.removeListener('getPoints', this.getPoints);
    ee.removeListener('rewardDeleted', this.handleChildDelete);
    // ee.removeListener('rewardEdited', this.updateChild);
  }

  // updateChild(itemID, newData) {
  //   this.state.rewards.map(el => {
  //     if (el._id == itemID) {
  //       el.name = newData.name;
  //       el.price = newData.price;
  //       el.repeated = newData.repeated;
  //     }
  //     return el;
  //   });
  // }

  getPoints(points){
    this.setState({points: points});
  }

  handleChildDelete(id) {
    let newRewards = this.state.rewards.slice();
    newRewards = newRewards.filter(el => el._id !== id);
    this.setState({rewards: newRewards});
  }

  handleNewRewardAdding(reward) {
    this.setState({rewards: [reward, ...this.state.rewards] });
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
        let newRewards = res.user.rewards.reverse();
        this.setState({rewards: newRewards});
      })
      .catch(err => {
        console.log(err);
      })
  }

  render () {
    return <div className = "rewards">
            <RewardsAddNew login = {this.props.params.login}
              onNewRewardAdded = {this.handleNewRewardAdding.bind(this)}
            />
            <div className = "rewardList">
              {
                this.state.rewards.map((el,i,arr) => {
                  return <RewardItem
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